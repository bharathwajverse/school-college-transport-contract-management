const { pool } = require('./src/config/db');
require('dotenv').config();

async function check() {
  try {
    const res = await pool.query(`
      SELECT id, full_name, email, role, is_active FROM users
    `);
    console.log("Users in database:", res.rows);
    process.exit(0);
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

check();
