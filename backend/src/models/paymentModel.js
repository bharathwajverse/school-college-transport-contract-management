const { query } = require("../config/db");

async function create(data) {
  const result = await query(
    `INSERT INTO payments (
      contract_id, invoice_number, billing_period_start, billing_period_end,
      amount, due_date, payment_date, payment_status, remarks
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'UNPAID'), $9)
    RETURNING *`,
    [
      data.contract_id,
      data.invoice_number,
      data.billing_period_start,
      data.billing_period_end,
      data.amount,
      data.due_date,
      data.payment_date || null,
      data.payment_status || "UNPAID",
      data.remarks || null
    ]
  );

  return result.rows[0];
}

async function findAll({ search, status, contractId }) {
  const values = [];
  const filters = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(p.invoice_number ILIKE $${values.length} OR c.contract_number ILIKE $${values.length})`);
  }

  if (status) {
    values.push(status);
    filters.push(`p.payment_status = $${values.length}`);
  }

  if (contractId) {
    values.push(contractId);
    filters.push(`p.contract_id = $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT p.*, c.contract_number, i.institution_name
     FROM payments p
     JOIN contracts c ON c.id = p.contract_id
     LEFT JOIN institutions i ON i.id = c.institution_id
     ${whereClause}
     ORDER BY p.created_at DESC`,
    values
  );

  return result.rows;
}

async function findById(id) {
  const result = await query("SELECT * FROM payments WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function update(id, data) {
  const result = await query(
    `UPDATE payments SET
      contract_id = COALESCE($2, contract_id),
      invoice_number = COALESCE($3, invoice_number),
      billing_period_start = COALESCE($4, billing_period_start),
      billing_period_end = COALESCE($5, billing_period_end),
      amount = COALESCE($6, amount),
      due_date = COALESCE($7, due_date),
      payment_date = COALESCE($8, payment_date),
      payment_status = COALESCE($9, payment_status),
      remarks = COALESCE($10, remarks)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.contract_id,
      data.invoice_number,
      data.billing_period_start,
      data.billing_period_end,
      data.amount,
      data.due_date,
      data.payment_date,
      data.payment_status,
      data.remarks
    ]
  );

  return result.rows[0] || null;
}

async function markStatus(id, paymentStatus) {
  const paymentDate = paymentStatus === "PAID" ? "CURRENT_DATE" : "payment_date";
  const result = await query(
    `UPDATE payments
     SET payment_status = $2, payment_date = ${paymentDate}
     WHERE id = $1
     RETURNING *`,
    [id, paymentStatus]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await query("DELETE FROM payments WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

async function markOverdue() {
  const result = await query(
    `UPDATE payments
     SET payment_status = 'OVERDUE'
     WHERE payment_status = 'UNPAID' AND due_date < CURRENT_DATE
     RETURNING *`
  );

  return result.rows;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  markStatus,
  remove,
  markOverdue
};

