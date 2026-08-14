const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  initiatePayU,
  payuSuccess,
  payuFailure,
} = require("../controllers/paymentController");

router.post("/api/payment/payu-initiate", requireAuth, initiatePayU);
router.post("/api/payment/payu-success", payuSuccess);
router.get("/api/payment/payu-success", payuSuccess);
router.post("/api/payment/payu-failure", payuFailure);
router.get("/api/payment/payu-failure", payuFailure);

module.exports = router;
