const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Make sure your .env has DATABASE_URL
  ssl: { rejectUnauthorized: false }
});

async function createUsersTable() {
  await client.connect();
  
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await client.query(query);
  console.log("✅ Users table created");
  await client.end();
}

createUsersTable().catch(err => console.error(err));
