const express = require("express");
const systemController = require("../controllers/systemController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/run-alert-engine", requireRole("ADMIN"), systemController.runAlertEngineNow);

module.exports = router;

