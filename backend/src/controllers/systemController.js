const { runAlertEngine } = require("../services/alertService");
const { asyncHandler } = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const runAlertEngineNow = asyncHandler(async (req, res) => {
  const result = await runAlertEngine();
  return success(res, result);
});

module.exports = { runAlertEngineNow };

