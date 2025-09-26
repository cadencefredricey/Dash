// server/index.js
require('dotenv').config();
console.log("🟢 index.js is running");

const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:8080", // frontend URL
  credentials: true
}));



// connect to Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // needed for Neon
});

// Register route (saves user to Postgres)
// Login route (checks username + password against DB) with debug logs
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username, password });

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      console.log("User not found in DB");
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    console.log("DB password hash:", user.password_hash);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Password match?", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: '✅ Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("❌ Error in /login:", err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Login route (checks username + password against DB)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash); // must match column name

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: '✅ Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("❌ Error in /login:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/', (req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
