const auditLogModel = require("../models/auditLogModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await auditLogModel.findAll();
  return success(res, logs);
});

module.exports = { getAuditLogs };

