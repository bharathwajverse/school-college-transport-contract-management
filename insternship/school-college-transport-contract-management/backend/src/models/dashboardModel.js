const { query } = require("../config/db");

async function summary() {
  const result = await query(
    `SELECT
      (SELECT COUNT(*)::int FROM contracts WHERE status = 'ACTIVE') AS active_contracts,
      (SELECT COUNT(*)::int FROM contracts WHERE status = 'PENDING_RENEWAL' OR renewal_date <= CURRENT_DATE + INTERVAL '30 days') AS pending_renewals,
      (SELECT COUNT(*)::int FROM payments WHERE payment_status = 'OVERDUE') AS overdue_payments,
      (SELECT COUNT(*)::int FROM alerts WHERE is_sent = FALSE AND alert_date >= CURRENT_DATE) AS upcoming_alerts,
      COALESCE((SELECT SUM(amount) FROM payments WHERE payment_status = 'PAID'), 0)::numeric AS total_revenue`
  );

  return result.rows[0];
}

async function revenueChart() {
  const result = await query(
    `SELECT TO_CHAR(payment_date, 'Mon') AS month,
            DATE_TRUNC('month', payment_date) AS month_start,
            SUM(amount)::numeric AS revenue
     FROM payments
     WHERE payment_status = 'PAID' AND payment_date IS NOT NULL
     GROUP BY month, month_start
     ORDER BY month_start ASC`
  );

  return result.rows.map(({ month, revenue }) => ({ month, revenue: Number(revenue) }));
}

module.exports = {
  summary,
  revenueChart
};

