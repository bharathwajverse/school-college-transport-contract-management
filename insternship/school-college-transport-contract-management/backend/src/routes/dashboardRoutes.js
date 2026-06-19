const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/summary", dashboardController.getSummary);
router.get("/revenue-chart", dashboardController.getRevenueChart);

module.exports = router;

