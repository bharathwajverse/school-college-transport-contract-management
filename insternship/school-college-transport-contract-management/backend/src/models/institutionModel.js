const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO institutions (
      institution_name, institution_type, contact_person, phone, email, address, city, state, status, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'ACTIVE'), $10)
    RETURNING *`,
    [
      data.institution_name,
      data.institution_type,
      data.contact_person,
      data.phone,
      data.email || null,
      data.address,
      data.city,
      data.state,
      data.status || "ACTIVE",
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
    filters.push(`(institution_name ILIKE $${values.length} OR contact_person ILIKE $${values.length} OR city ILIKE $${values.length})`);
  }

  if (status) {
    values.push(status);
    filters.push(`status = $${values.length}`);
  }

  values.push(limit);
  const limitParam = values.length;
  values.push(offset);
  const offsetParam = values.length;

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT * FROM institutions
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    values
  );

  return result.rows;
}

async function findById(id) {
  const result = await query("SELECT * FROM institutions WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function update(id, data) {
  const result = await query(
    `UPDATE institutions SET
      institution_name = COALESCE($2, institution_name),
      institution_type = COALESCE($3, institution_type),
      contact_person = COALESCE($4, contact_person),
      phone = COALESCE($5, phone),
      email = COALESCE($6, email),
      address = COALESCE($7, address),
      city = COALESCE($8, city),
      state = COALESCE($9, state),
      status = COALESCE($10, status),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.institution_name,
      data.institution_type,
      data.contact_person,
      data.phone,
      data.email,
      data.address,
      data.city,
      data.state,
      data.status
    ]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await query("DELETE FROM institutions WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};

