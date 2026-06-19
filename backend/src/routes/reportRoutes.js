const express = require("express");
const reportController = require("../controllers/reportController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/revenue-trend", reportController.revenueTrend);
router.get("/contract-status", reportController.contractStatus);
router.get("/export", reportController.exportReport);

module.exports = router;

