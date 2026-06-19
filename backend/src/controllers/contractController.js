const contractModel = require("../models/contractModel");
const { recordAudit } = require("../middleware/auditMiddleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success, message } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

function validateContract(data) {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const renewalDate = new Date(data.renewal_date);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || Number.isNaN(renewalDate.getTime())) {
    throw new AppError("Valid start_date, end_date, and renewal_date are required", 400);
  }

  if (endDate <= startDate) {
    throw new AppError("end_date must be after start_date", 422);
  }

  if (renewalDate > endDate) {
    throw new AppError("renewal_date must be on or before end_date", 422);
  }

  if (Number(data.contract_value) <= 0) {
    throw new AppError("contract_value must be greater than 0", 422);
  }
}

const createContract = asyncHandler(async (req, res) => {
  const required = [
    "institution_id",
    "contract_number",
    "start_date",
    "end_date",
    "renewal_date",
    "billing_cycle",
    "contract_value"
  ];

  for (const field of required) {
    if (!req.body[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  validateContract(req.body);

  const contract = await contractModel.create({
    ...req.body,
    created_by: req.user.id
  });

  await recordAudit({
    req,
    entityType: "CONTRACT",
    entityId: contract.id,
    action: "CREATE",
    newValue: contract
  });

  return success(res, contract, 201);
});

const getContracts = asyncHandler(async (req, res) => {
  const { limit, offset, page } = getPagination(req.query);
  const contracts = await contractModel.findAll({
    limit,
    offset,
    search: req.query.search,
    status: req.query.status
  });

  return success(res, { page, limit, items: contracts });
});

const getContract = asyncHandler(async (req, res) => {
  const contract = await contractModel.findById(req.params.id);
  if (!contract) {
    throw new AppError("Contract not found", 404);
  }

  return success(res, contract);
});

const updateContract = asyncHandler(async (req, res) => {
  const oldValue = await contractModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Contract not found", 404);
  }

  const merged = { ...oldValue, ...req.body };
  validateContract(merged);

  const contract = await contractModel.update(req.params.id, req.body);

  await recordAudit({
    req,
    entityType: "CONTRACT",
    entityId: contract.id,
    action: "UPDATE",
    oldValue,
    newValue: contract
  });

  return success(res, contract);
});

const deleteContract = asyncHandler(async (req, res) => {
  const oldValue = await contractModel.remove(req.params.id);
  if (!oldValue) {
    throw new AppError("Contract not found", 404);
  }

  await recordAudit({
    req,
    entityType: "CONTRACT",
    entityId: oldValue.id,
    action: "DELETE",
    oldValue
  });

  return message(res, "Contract deleted");
});

const getContractDetail = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  const contract = await contractModel.findById(contractId);
  if (!contract) {
    throw new AppError("Contract not found", 404);
  }

  const { query } = require("../config/db");
  const [paymentsRes, routesRes, vehiclesRes, alertsRes, auditLogsRes] = await Promise.all([
    query("SELECT * FROM payments WHERE contract_id = $1 ORDER BY due_date ASC", [contractId]),
    query("SELECT * FROM routes WHERE contract_id = $1 ORDER BY route_name ASC", [contractId]),
    query("SELECT * FROM vehicles WHERE contract_id = $1 ORDER BY vehicle_number ASC", [contractId]),
    query("SELECT * FROM alerts WHERE contract_id = $1 ORDER BY alert_date DESC", [contractId]),
    query(`
      SELECT a.*, u.full_name as user_name 
      FROM audit_logs a 
      LEFT JOIN users u ON u.id = a.user_id 
      WHERE a.entity_type = 'CONTRACT' AND a.entity_id = $1 
      ORDER BY a.created_at DESC
    `, [contractId])
  ]);

  return success(res, {
    contract,
    payments: paymentsRes.rows,
    routes: routesRes.rows,
    vehicles: vehiclesRes.rows,
    alerts: alertsRes.rows,
    auditLogs: auditLogsRes.rows
  });
});

module.exports = {
  createContract,
  getContracts,
  getContract,
  updateContract,
  deleteContract,
  getContractDetail
};

