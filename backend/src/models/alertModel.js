const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO alerts (contract_id, alert_type, alert_date, message, is_sent, sent_at)
     VALUES ($1, $2, $3, $4, COALESCE($5, FALSE), $6)
     RETURNING *`,
    [
      data.contract_id,
      data.alert_type,
      data.alert_date,
      data.message,
      data.is_sent || false,
      data.sent_at || null
    ]
  );

  return result.rows[0];
}

async function createIfMissing(data) {
  const existing = await query(
    `SELECT id FROM alerts
     WHERE contract_id = $1 AND alert_type = $2 AND alert_date = $3 AND message = $4
     LIMIT 1`,
    [data.contract_id, data.alert_type, data.alert_date, data.message]
  );

  if (existing.rows[0]) {
    return { created: false, alert: existing.rows[0] };
  }

  const alert = await create(data);
  return { created: true, alert };
}

async function findAll({ status }) {
  const values = [];
  const filters = [];

  if (status === "sent") {
    filters.push("a.is_sent = TRUE");
  }

  if (status === "pending" || status === "new") {
    filters.push("a.is_sent = FALSE");
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT a.*, c.contract_number, i.institution_name
     FROM alerts a
     JOIN contracts c ON c.id = a.contract_id
     LEFT JOIN institutions i ON i.id = c.institution_id
     ${whereClause}
     ORDER BY a.alert_date ASC, a.created_at DESC`,
    values
  );

  return result.rows;
}

async function upcoming(limit = 10) {
  const result = await query(
    `SELECT a.*, c.contract_number, i.institution_name
     FROM alerts a
     JOIN contracts c ON c.id = a.contract_id
     LEFT JOIN institutions i ON i.id = c.institution_id
     WHERE a.is_sent = FALSE AND a.alert_date >= CURRENT_DATE
     ORDER BY a.alert_date ASC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}

async function findById(id) {
  const result = await query("SELECT * FROM alerts WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function markSent(id) {
  const result = await query(
    `UPDATE alerts
     SET is_sent = TRUE, sent_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  create,
  createIfMissing,
  findAll,
  upcoming,
  findById,
  markSent
};

