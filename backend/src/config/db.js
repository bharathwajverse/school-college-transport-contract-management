const { Pool } = require("pg");
const { env } = require("./env");
const logger = require("../utils/logger");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === "production" ? { rejectUnauthorized: false } : false
});

pool.on("error", (error) => {
  logger.error("Unexpected PostgreSQL pool error", { error });
});

async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result;
}

async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query,
  withTransaction
};

