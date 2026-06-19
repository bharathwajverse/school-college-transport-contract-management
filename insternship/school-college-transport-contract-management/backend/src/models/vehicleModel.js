const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO vehicles (
      contract_id, vehicle_number, vehicle_type, capacity, insurance_expiry, fitness_expiry, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'ACTIVE'))
    RETURNING *`,
    [
      data.contract_id,
      data.vehicle_number,
      data.vehicle_type,
      data.capacity,
      data.insurance_expiry,
      data.fitness_expiry || null,
      data.status || "ACTIVE"
    ]
  );

  return result.rows[0];
}

async function findAll({ contractId }) {
  const values = [];
  const filters = [];

  if (contractId) {
    values.push(contractId);
    filters.push(`v.contract_id = $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT v.*, c.contract_number
     FROM vehicles v
     JOIN contracts c ON c.id = v.contract_id
     ${whereClause}
     ORDER BY v.created_at DESC`,
    values
  );

  return result.rows;
}

async function findById(id) {
  const result = await query("SELECT * FROM vehicles WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function update(id, data) {
  const result = await query(
    `UPDATE vehicles SET
      contract_id = COALESCE($2, contract_id),
      vehicle_number = COALESCE($3, vehicle_number),
      vehicle_type = COALESCE($4, vehicle_type),
      capacity = COALESCE($5, capacity),
      insurance_expiry = COALESCE($6, insurance_expiry),
      fitness_expiry = COALESCE($7, fitness_expiry),
      status = COALESCE($8, status)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.contract_id,
      data.vehicle_number,
      data.vehicle_type,
      data.capacity,
      data.insurance_expiry,
      data.fitness_expiry,
      data.status
    ]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

async function findForInsuranceAlertScan() {
  const result = await query(
    `SELECT v.*, c.contract_number, i.institution_name
     FROM vehicles v
     JOIN contracts c ON c.id = v.contract_id
     LEFT JOIN institutions i ON i.id = c.institution_id
     WHERE v.status = 'ACTIVE'`
  );

  return result.rows;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findForInsuranceAlertScan
};

