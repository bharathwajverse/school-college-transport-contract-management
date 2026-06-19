const express = require("express");
const auditLogController = require("../controllers/auditLogController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN"));
router.get("/", auditLogController.getAuditLogs);

module.exports = router;

