const institutionModel = require("../models/institutionModel");
const { recordAudit } = require("../middleware/auditMiddleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success, message } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

const createInstitution = asyncHandler(async (req, res) => {
  const required = ["institution_name", "institution_type", "contact_person", "phone", "email", "address", "city", "state"];
  for (const field of required) {
    if (!req.body[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const institution = await institutionModel.create({
    ...req.body,
    created_by: req.user.id
  });

  await recordAudit({
    req,
    entityType: "INSTITUTION",
    entityId: institution.id,
    action: "CREATE",
    newValue: institution
  });

  return success(res, institution, 201);
});

const getInstitutions = asyncHandler(async (req, res) => {
  const { limit, offset, page } = getPagination(req.query);
  const institutions = await institutionModel.findAll({
    limit,
    offset,
    search: req.query.search,
    status: req.query.status
  });

  return success(res, { page, limit, items: institutions });
});

const getInstitution = asyncHandler(async (req, res) => {
  const institution = await institutionModel.findById(req.params.id);
  if (!institution) {
    throw new AppError("Institution not found", 404);
  }

  return success(res, institution);
});

const updateInstitution = asyncHandler(async (req, res) => {
  const oldValue = await institutionModel.findById(req.params.id);
  if (!oldValue) {
    throw new AppError("Institution not found", 404);
  }

  const institution = await institutionModel.update(req.params.id, req.body);

  await recordAudit({
    req,
    entityType: "INSTITUTION",
    entityId: institution.id,
    action: "UPDATE",
    oldValue,
    newValue: institution
  });

  return success(res, institution);
});

const deleteInstitution = asyncHandler(async (req, res) => {
  const oldValue = await institutionModel.remove(req.params.id);
  if (!oldValue) {
    throw new AppError("Institution not found", 404);
  }

  await recordAudit({
    req,
    entityType: "INSTITUTION",
    entityId: oldValue.id,
    action: "DELETE",
    oldValue
  });

  return message(res, "Institution deleted");
});

module.exports = {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution
};

