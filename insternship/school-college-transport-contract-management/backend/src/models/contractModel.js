const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO contracts (
      institution_id, contract_number, start_date, end_date, renewal_date, billing_cycle,
      contract_value, status, notes, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'ACTIVE'), $9, $10)
    RETURNING *`,
    [
      data.institution_id,
      data.contract_number,
      data.start_date,
      data.end_date,
      data.renewal_date,
      data.billing_cycle,
      data.contract_value,
      data.status || "ACTIVE",
      data.notes || null,
      data.created_by || null
    ]
  );

  return result.rows[0];
}

async function findAll({ limit, offset, search, status }) {
  const values = [];
  const filters = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(c.contract_number ILIKE $${values.length} OR i.institution_name ILIKE $${values.length})`);
  }

  if (status) {
    values.push(status);
    filters.push(`c.status = $${values.length}`);
  }

  values.push(limit);
  const limitParam = values.length;
  values.push(offset);
  const offsetParam = values.length;

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT c.*, i.institution_name
     FROM contracts c
     LEFT JOIN institutions i ON i.id = c.institution_id
     ${whereClause}
     ORDER BY c.created_at DESC
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    values
  );

  return result.rows;
}

async function findById(id) {
  const result = await query(
    `SELECT c.*, i.institution_name
     FROM contracts c
     LEFT JOIN institutions i ON i.id = c.institution_id
     WHERE c.id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function update(id, data) {
  const result = await query(
    `UPDATE contracts SET
      institution_id = COALESCE($2, institution_id),
      contract_number = COALESCE($3, contract_number),
      start_date = COALESCE($4, start_date),
      end_date = COALESCE($5, end_date),
      renewal_date = COALESCE($6, renewal_date),
      billing_cycle = COALESCE($7, billing_cycle),
      contract_value = COALESCE($8, contract_value),
      status = COALESCE($9, status),
      notes = COALESCE($10, notes),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.institution_id,
      data.contract_number,
      data.start_date,
      data.end_date,
      data.renewal_date,
      data.billing_cycle,
      data.contract_value,
      data.status,
      data.notes
    ]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await query("DELETE FROM contracts WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

async function findForAlertScan() {
  const result = await query(
    `SELECT c.*, i.institution_name
     FROM contracts c
     LEFT JOIN institutions i ON i.id = c.institution_id
     WHERE c.status IN ('ACTIVE', 'PENDING_RENEWAL')`
  );
  return result.rows;
}

async function updateDerivedStatuses() {
  await query(
    `UPDATE contracts
     SET status = 'EXPIRED', updated_at = CURRENT_TIMESTAMP
     WHERE end_date < CURRENT_DATE AND status != 'TERMINATED'`
  );

  await query(
    `UPDATE contracts
     SET status = 'PENDING_RENEWAL', updated_at = CURRENT_TIMESTAMP
     WHERE renewal_date <= CURRENT_DATE + INTERVAL '30 days'
       AND end_date >= CURRENT_DATE
       AND status = 'ACTIVE'`
  );
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findForAlertScan,
  updateDerivedStatuses
};

