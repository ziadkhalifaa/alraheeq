
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'alraheeq'
});

async function main() {
  try {
    await pool.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title JSONB, ADD COLUMN IF NOT EXISTS meta_description JSONB');
    console.log("Columns added successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error adding columns:", err);
    process.exit(1);
  }
}

main();
