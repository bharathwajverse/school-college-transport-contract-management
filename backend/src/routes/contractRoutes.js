const express = require("express");
const contractController = require("../controllers/contractController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", contractController.getContracts);
router.get("/:id", contractController.getContract);
router.get("/:id/detail", contractController.getContractDetail);
router.post("/", requireRole("ADMIN", "STAFF"), contractController.createContract);
router.put("/:id", requireRole("ADMIN", "STAFF"), contractController.updateContract);
router.delete("/:id", requireRole("ADMIN"), contractController.deleteContract);

module.exports = router;

