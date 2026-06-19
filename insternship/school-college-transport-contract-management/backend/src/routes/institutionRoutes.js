const express = require("express");
const institutionController = require("../controllers/institutionController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", institutionController.getInstitutions);
router.get("/:id", institutionController.getInstitution);
router.post("/", requireRole("ADMIN", "STAFF"), institutionController.createInstitution);
router.put("/:id", requireRole("ADMIN", "STAFF"), institutionController.updateInstitution);
router.delete("/:id", requireRole("ADMIN"), institutionController.deleteInstitution);

module.exports = router;

