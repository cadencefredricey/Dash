require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function addColumn() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN password_hash TEXT;
    `);
    console.log('✅ password_hash column added!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding password_hash column:', err);
    process.exit(1);
  }
}

addColumn();
