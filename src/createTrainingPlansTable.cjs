// createTrainingPlansTable.js
require('dotenv').config({ path: '../server/.env' }); // adjust path relative to src/

const { Pool } = require('pg');

console.log("Connecting with:", process.env.DATABASE_URL); // 👈 check this


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS training_plans (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        day VARCHAR(50),
        type VARCHAR(50),
        title VARCHAR(200),
        duration VARCHAR(100),
        intensity VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ training_plans table created");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating training_plans table:", err);
    process.exit(1);
  }
};

createTable();
