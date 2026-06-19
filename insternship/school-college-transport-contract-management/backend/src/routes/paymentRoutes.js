const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", paymentController.getPayments);
router.get("/:id", paymentController.getPayment);
router.post("/", requireRole("ADMIN", "STAFF"), paymentController.createPayment);
router.put("/:id", requireRole("ADMIN", "STAFF"), paymentController.updatePayment);
router.patch("/:id/status", requireRole("ADMIN", "STAFF"), paymentController.updatePaymentStatus);
router.delete("/:id", requireRole("ADMIN"), paymentController.deletePayment);

module.exports = router;

