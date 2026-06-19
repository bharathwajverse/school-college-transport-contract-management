const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getVehicle);
router.post("/", requireRole("ADMIN", "STAFF"), vehicleController.createVehicle);
router.put("/:id", requireRole("ADMIN", "STAFF"), vehicleController.updateVehicle);
router.delete("/:id", requireRole("ADMIN"), vehicleController.deleteVehicle);

module.exports = router;

