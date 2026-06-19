const express = require("express");
const routeController = require("../controllers/routeController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", routeController.getRoutes);
router.get("/:id", routeController.getRoute);
router.post("/", requireRole("ADMIN", "STAFF"), routeController.createRoute);
router.put("/:id", requireRole("ADMIN", "STAFF"), routeController.updateRoute);
router.delete("/:id", requireRole("ADMIN"), routeController.deleteRoute);

module.exports = router;

