const routeModel = require("../models/routeModel");
const { recordAudit } = require("../middleware/auditMiddleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success, message } = require("../utils/apiResponse");

const createRoute = asyncHandler(async (req, res) => {
  const required = ["contract_id", "route_name", "pickup_points", "drop_points", "distance_km"];
  for (const field of required) {
    if (req.body[field] === undefined) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const route = await routeModel.create(req.body);
  await recordAudit({ req, entityType: "ROUTE", entityId: route.id, action: "CREATE", newValue: route });

  return success(res, route, 201);
});

const getRoutes = asyncHandler(async (req, res) => {
  const routes = await routeModel.findAll({ contractId: req.query.contract_id });
  return success(res, routes);
});

const getRoute = asyncHandler(async (req, res) => {
  const route = await routeModel.findById(req.params.id);
  if (!route) {
    throw new AppError("Route not found", 404);
  }

  return success(res, route);
});

const updateRoute = asyncHandler(async (req, res) => {
  const oldValue = await routeModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Route not found", 404);
  }

  const route = await routeModel.update(req.params.id, req.body);
  await recordAudit({ req, entityType: "ROUTE", entityId: route.id, action: "UPDATE", oldValue, newValue: route });

  return success(res, route);
});

const deleteRoute = asyncHandler(async (req, res) => {
  const oldValue = await routeModel.remove(req.params.id);
  if (!oldValue) {
    throw new AppError("Route not found", 404);
  }

  await recordAudit({ req, entityType: "ROUTE", entityId: oldValue.id, action: "DELETE", oldValue });

  return message(res, "Route deleted");
});

module.exports = {
  createRoute,
  getRoutes,
  getRoute,
  updateRoute,
  deleteRoute
};

