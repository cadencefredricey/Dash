const jwt = require("jsonwebtoken");



// server/index.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

// connect to Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ REGISTER route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // check if user already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("❌ Error in /register:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ LOGIN route (you already had this one)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    if (!user.password_hash) {
      return res.status(400).json({ error: 'User has no password set' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
  return res.status(400).json({ error: 'Invalid username or password' });
}

// Create JWT token
const token = jwt.sign(
  { id: user.id, username: user.username },
  process.env.JWT_SECRET || "dev_secret", // store in .env for safety
  { expiresIn: "1h" }
);

// Return token + user info
res.json({ 
  token, 
  user: { id: user.id, username: user.username, email: user.email } 
});

  } catch (err) {
    console.error("❌ Error in /login:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
