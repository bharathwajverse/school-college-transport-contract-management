const express = require("express");
const alertController = require("../controllers/alertController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", alertController.getAlerts);
router.get("/upcoming", alertController.getUpcomingAlerts);
router.post("/manual", requireRole("ADMIN", "STAFF"), alertController.createManualAlert);
router.patch("/:id/sent", requireRole("ADMIN", "STAFF"), alertController.markAlertSent);

module.exports = router;

