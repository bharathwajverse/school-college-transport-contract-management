const paymentModel = require("../models/paymentModel");
const { recordAudit } = require("../middleware/auditMiddleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success, message } = require("../utils/apiResponse");

const allowedStatuses = ["UNPAID", "PAID", "OVERDUE"];

const createPayment = asyncHandler(async (req, res) => {
  const required = ["contract_id", "invoice_number", "billing_period_start", "billing_period_end", "amount", "due_date"];
  for (const field of required) {
    if (!req.body[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  if (Number(req.body.amount) <= 0) {
    throw new AppError("amount must be greater than 0", 422);
  }

  const payment = await paymentModel.create(req.body);
  await recordAudit({ req, entityType: "PAYMENT", entityId: payment.id, action: "CREATE", newValue: payment });

  return success(res, payment, 201);
});

const getPayments = asyncHandler(async (req, res) => {
  const payments = await paymentModel.findAll({
    search: req.query.search,
    status: req.query.status,
    contractId: req.query.contract_id
  });

  return success(res, payments);
});

const getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentModel.findById(req.params.id);
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  return success(res, payment);
});

const updatePayment = asyncHandler(async (req, res) => {
  const oldValue = await paymentModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Payment not found", 404);
  }

  const payment = await paymentModel.update(req.params.id, req.body);
  await recordAudit({ req, entityType: "PAYMENT", entityId: payment.id, action: "UPDATE", oldValue, newValue: payment });

  return success(res, payment);
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { payment_status } = req.body;
  if (!allowedStatuses.includes(payment_status)) {
    throw new AppError("Invalid payment_status", 400);
  }

  const oldValue = await paymentModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Payment not found", 404);
  }

  const payment = await paymentModel.markStatus(req.params.id, payment_status);
  await recordAudit({ req, entityType: "PAYMENT", entityId: payment.id, action: "UPDATE", oldValue, newValue: payment });

  return success(res, payment);
});

const deletePayment = asyncHandler(async (req, res) => {
  const oldValue = await paymentModel.remove(req.params.id);
  if (!oldValue) {
    throw new AppError("Payment not found", 404);
  }

  await recordAudit({ req, entityType: "PAYMENT", entityId: oldValue.id, action: "DELETE", oldValue });

  return message(res, "Payment deleted");
});

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  updatePaymentStatus,
  deletePayment
};

