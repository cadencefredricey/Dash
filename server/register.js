const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); // for hashing passwords
const cors = require("cors");

app.use(cors()); // allow frontend requests
app.use(express.json());

// Example: in-memory users (replace with Neon DB later)


// REGISTER route (your existing one)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash: hashedPassword });
  res.json({ msg: "User registered!" });
});

// LOGIN route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  // In real app, return JWT token instead
  res.json({ success: true, token: "fake-jwt-token" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
