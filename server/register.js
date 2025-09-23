const express = require("express");
const app = express();

app.use(express.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  // For now, just return the received data
  res.json({ username, password, msg: "Received!" });
});

const PORT = 5000; // Use a different port than your main server for now
app.listen(PORT, () => console.log(`Register server running on http://localhost:${PORT}`));
