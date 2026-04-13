const PLANS = {
  free: {
    key: "free",
    name: "Free",
    monthlyPrice: 0,
    resumeChecksPerMonth: 3,
    adsEnabled: true,
    features: ["resumeAnalysis"],
  },
  pro: {
    key: "pro",
    name: "Pro",
    monthlyPrice: 3,
    resumeChecksPerMonth: null,
    adsEnabled: false,
    features: ["resumeAnalysis", "resumeRewrite", "coverLetter"],
  },
  premium: {
    key: "premium",
    name: "Premium",
    monthlyPrice: 5,
    resumeChecksPerMonth: null,
    adsEnabled: false,
    features: ["resumeAnalysis", "resumeRewrite", "coverLetter", "jobMatch", "advancedFeedback", "keywordOptimization"],
  },
};

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function getPlanConfig(planKey = "free") {
  return PLANS[planKey] || PLANS.free;
}

function syncUsageWindow(user) {
  const currentMonthKey = getCurrentMonthKey();

  if (!user.usage || user.usage.monthKey !== currentMonthKey) {
    user.usage = {
      monthKey: currentMonthKey,
      resumeChecks: 0,
    };
  }

  return user;
}

function getUsageSnapshot(user) {
  const syncedUser = syncUsageWindow(user);
  const plan = getPlanConfig(syncedUser.plan);
  const used = syncedUser.usage.resumeChecks;

  return {
    monthKey: syncedUser.usage.monthKey,
    usedResumeChecks: used,
    limit: plan.resumeChecksPerMonth,
    remainingResumeChecks:
      plan.resumeChecksPerMonth === null ? null : Math.max(plan.resumeChecksPerMonth - used, 0),
  };
}

function canRunResumeAnalysis(user) {
  const syncedUser = syncUsageWindow(user);
  const plan = getPlanConfig(syncedUser.plan);

  if (plan.resumeChecksPerMonth === null) {
    return { allowed: true, usage: getUsageSnapshot(syncedUser) };
  }

  return {
    allowed: syncedUser.usage.resumeChecks < plan.resumeChecksPerMonth,
    usage: getUsageSnapshot(syncedUser),
  };
}

function consumeResumeCheck(user) {
  const syncedUser = syncUsageWindow(user);
  const plan = getPlanConfig(syncedUser.plan);

  if (plan.resumeChecksPerMonth !== null) {
    syncedUser.usage.resumeChecks += 1;
  }

  return syncedUser;
}

function hasFeatureAccess(planKey, feature) {
  const plan = getPlanConfig(planKey);
  return plan.features.includes(feature);
}

function getPlanFromPriceId(priceId) {
  if (!priceId) {
    return "free";
  }

  const env = require("../config/env");

  if (priceId === env.STRIPE_PRO_PRICE_ID) {
    return "pro";
  }

  if (priceId === env.STRIPE_PREMIUM_PRICE_ID) {
    return "premium";
  }

  return "free";
}

function publicPlans() {
  return Object.values(PLANS).map((plan) => ({
    key: plan.key,
    name: plan.name,
    monthlyPrice: plan.monthlyPrice,
    resumeChecksPerMonth: plan.resumeChecksPerMonth,
    adsEnabled: plan.adsEnabled,
    features: plan.features,
  }));
}

module.exports = {
  PLANS,
  canRunResumeAnalysis,
  consumeResumeCheck,
  getPlanConfig,
  getPlanFromPriceId,
  getUsageSnapshot,
  hasFeatureAccess,
  publicPlans,
  syncUsageWindow,
};
