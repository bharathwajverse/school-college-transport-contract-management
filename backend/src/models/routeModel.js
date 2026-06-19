const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO routes (contract_id, route_name, pickup_points, drop_points, distance_km, route_status)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'ACTIVE'))
     RETURNING *`,
    [
      data.contract_id,
      data.route_name,
      JSON.stringify(data.pickup_points || []),
      JSON.stringify(data.drop_points || []),
      data.distance_km,
      data.route_status || "ACTIVE"
    ]
  );

  return result.rows[0];
}

async function findAll({ contractId }) {
  const values = [];
  const filters = [];

  if (contractId) {
    values.push(contractId);
    filters.push(`r.contract_id = $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT r.*, c.contract_number
     FROM routes r
     JOIN contracts c ON c.id = r.contract_id
     ${whereClause}
     ORDER BY r.created_at DESC`,
    values
  );

  return result.rows;
}

async function findById(id) {
  const result = await query("SELECT * FROM routes WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function update(id, data) {
  const result = await query(
    `UPDATE routes SET
      contract_id = COALESCE($2, contract_id),
      route_name = COALESCE($3, route_name),
      pickup_points = COALESCE($4, pickup_points),
      drop_points = COALESCE($5, drop_points),
      distance_km = COALESCE($6, distance_km),
      route_status = COALESCE($7, route_status)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.contract_id,
      data.route_name,
      data.pickup_points ? JSON.stringify(data.pickup_points) : null,
      data.drop_points ? JSON.stringify(data.drop_points) : null,
      data.distance_km,
      data.route_status
    ]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await query("DELETE FROM routes WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};

