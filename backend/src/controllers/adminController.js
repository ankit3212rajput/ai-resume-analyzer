const mongoose = require("mongoose");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const User = require("../models/User");
const { getUsageSnapshot, publicPlans } = require("../utils/planConfig");
const { sanitizePlainText } = require("../utils/sanitize");

async function getUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 }).limit(100);

  return res.json({
    success: true,
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      usage: getUsageSnapshot(user),
      createdAt: user.createdAt,
    })),
  });
}

async function getAnalysisLogs(_req, res) {
  const logs = await ResumeAnalysis.find()
    .populate("user", "name email plan")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json({
    success: true,
    logs,
  });
}

async function getPlanSummary(_req, res) {
  const counts = await User.aggregate([
    {
      $group: {
        _id: "$plan",
        total: { $sum: 1 },
      },
    },
  ]);

  return res.json({
    success: true,
    plans: publicPlans(),
    counts,
  });
}

async function updateUserPlan(req, res) {
  const plan = sanitizePlainText(req.body.plan, 30).toLowerCase();
  const subscriptionStatus = sanitizePlainText(req.body.subscriptionStatus, 30).toLowerCase() || "active";

  if (!["free", "pro", "premium"].includes(plan)) {
    return res.status(400).json({
      success: false,
      message: "Invalid plan selection",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      plan,
      subscriptionStatus,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    success: true,
    message: "User plan updated",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
    },
  });
}

module.exports = {
  getAnalysisLogs,
  getPlanSummary,
  getUsers,
  updateUserPlan,
};
