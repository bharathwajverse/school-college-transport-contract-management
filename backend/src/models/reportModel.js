const { query } = require("../config/db");

async function revenueTrend(startDate, endDate) {
  const params = [];
  const filters = [];

  if (startDate) {
    params.push(startDate);
    filters.push(`payment_date >= $${params.length}`);
  }
  if (endDate) {
    params.push(endDate);
    filters.push(`payment_date <= $${params.length}`);
  }

  const whereClause = filters.length 
    ? `AND ${filters.join(" AND ")}` 
    : "";

  const result = await query(
    `SELECT TO_CHAR(DATE_TRUNC('month', payment_date), 'YYYY-MM') AS month,
            SUM(amount)::numeric AS revenue
     FROM payments
     WHERE payment_status = 'PAID' AND payment_date IS NOT NULL ${whereClause}
     GROUP BY DATE_TRUNC('month', payment_date)
     ORDER BY DATE_TRUNC('month', payment_date)`,
    params
  );

  return result.rows.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue)
  }));
}

async function contractStatus(startDate, endDate) {
  const params = [];
  const filters = [];

  if (startDate) {
    params.push(startDate);
    filters.push(`start_date >= $${params.length}`);
  }
  if (endDate) {
    params.push(endDate);
    filters.push(`start_date <= $${params.length}`);
  }

  const whereClause = filters.length 
    ? `WHERE ${filters.join(" AND ")}` 
    : "";

  const result = await query(
    `SELECT status, COUNT(*)::int AS count
     FROM contracts
     ${whereClause}
     GROUP BY status
     ORDER BY status`,
    params
  );

  return result.rows;
}

async function exportRows(type, startDate, endDate) {
  if (type === "contract-status") {
    return contractStatus(startDate, endDate);
  }

  return revenueTrend(startDate, endDate);
}

module.exports = {
  revenueTrend,
  contractStatus,
  exportRows
};

