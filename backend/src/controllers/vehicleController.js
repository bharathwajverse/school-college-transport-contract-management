const vehicleModel = require("../models/vehicleModel");
const { recordAudit } = require("../middleware/auditMiddleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success, message } = require("../utils/apiResponse");

const createVehicle = asyncHandler(async (req, res) => {
  const required = ["contract_id", "vehicle_number", "vehicle_type", "capacity", "insurance_expiry"];
  for (const field of required) {
    if (!req.body[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const vehicle = await vehicleModel.create(req.body);
  await recordAudit({ req, entityType: "VEHICLE", entityId: vehicle.id, action: "CREATE", newValue: vehicle });

  return success(res, vehicle, 201);
});

const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleModel.findAll({ contractId: req.query.contract_id });
  return success(res, vehicles);
});

const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleModel.findById(req.params.id);
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  return success(res, vehicle);
});

const updateVehicle = asyncHandler(async (req, res) => {
  const oldValue = await vehicleModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Vehicle not found", 404);
  }

  const vehicle = await vehicleModel.update(req.params.id, req.body);
  await recordAudit({ req, entityType: "VEHICLE", entityId: vehicle.id, action: "UPDATE", oldValue, newValue: vehicle });

  return success(res, vehicle);
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const oldValue = await vehicleModel.remove(req.params.id);
  if (!oldValue) {
    throw new AppError("Vehicle not found", 404);
  }

  await recordAudit({ req, entityType: "VEHICLE", entityId: oldValue.id, action: "DELETE", oldValue });

  return message(res, "Vehicle deleted");
});

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
};

