const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO audit_logs (user_id, entity_type, entity_id, action, old_value, new_value)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.user_id,
      data.entity_type,
      data.entity_id,
      data.action,
      data.old_value ? JSON.stringify(data.old_value) : null,
      data.new_value ? JSON.stringify(data.new_value) : null
    ]
  );

  return result.rows[0];
}

async function findAll() {
  const result = await query(
    `SELECT a.*, u.full_name, u.email
     FROM audit_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC`
  );

  return result.rows;
}

module.exports = {
  create,
  findAll
};

