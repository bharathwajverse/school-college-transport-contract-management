const dashboardModel = require("../models/dashboardModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardModel.summary();
  return success(res, summary);
});

const getRevenueChart = asyncHandler(async (req, res) => {
  const chart = await dashboardModel.revenueChart();
  return success(res, chart);
});

module.exports = {
  getSummary,
  getRevenueChart
};

