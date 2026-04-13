const express = require("express");

const { getAnalysisLogs, getPlanSummary, getUsers, updateUserPlan } = require("../controllers/adminController");
const { adminOnly, protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getUsers);
router.get("/analyses", getAnalysisLogs);
router.get("/plans", getPlanSummary);
router.patch("/users/:userId/plan", updateUserPlan);

module.exports = router;
