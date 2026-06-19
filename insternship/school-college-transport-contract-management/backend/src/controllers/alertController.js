const alertModel = require("../models/alertModel");
const { recordAudit } = require("../middleware/auditMiddleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success } = require("../utils/apiResponse");

const createManualAlert = asyncHandler(async (req, res) => {
  const { contract_id, alert_type = "RENEWAL", message, alert_date } = req.body;

  if (!contract_id || !message) {
    throw new AppError("contract_id and message are required", 400);
  }

  const alert = await alertModel.create({
    contract_id,
    alert_type,
    message,
    alert_date: alert_date || new Date().toISOString().slice(0, 10)
  });

  await recordAudit({ req, entityType: "ALERT", entityId: alert.id, action: "CREATE", newValue: alert });

  return success(res, alert, 201);
});

const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await alertModel.findAll({ status: req.query.status });
  return success(res, alerts);
});

const getUpcomingAlerts = asyncHandler(async (req, res) => {
  const alerts = await alertModel.upcoming(Number(req.query.limit || 10));
  return success(res, alerts);
});

const markAlertSent = asyncHandler(async (req, res) => {
  const oldValue = await alertModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Alert not found", 404);
  }

  const alert = await alertModel.markSent(req.params.id);
  await recordAudit({ req, entityType: "ALERT", entityId: alert.id, action: "UPDATE", oldValue, newValue: alert });

  return success(res, alert);
});

module.exports = {
  createManualAlert,
  getAlerts,
  getUpcomingAlerts,
  markAlertSent
};

