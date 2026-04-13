const express = require("express");

const { createCheckoutSession, createPortalSession, getPlans } = require("../controllers/billingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/plans", getPlans);
router.post("/checkout", protect, createCheckoutSession);
router.post("/portal", protect, createPortalSession);

module.exports = router;
