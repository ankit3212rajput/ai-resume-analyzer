const Stripe = require("stripe");

const env = require("../config/env");
const User = require("../models/User");
const { getPlanFromPriceId, publicPlans } = require("../utils/planConfig");
const { sanitizePlainText } = require("../utils/sanitize");

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

function getPriceIdForPlan(plan) {
  if (plan === "pro") {
    return env.STRIPE_PRO_PRICE_ID;
  }

  if (plan === "premium") {
    return env.STRIPE_PREMIUM_PRICE_ID;
  }

  return "";
}

async function getPlans(_req, res) {
  return res.json({
    success: true,
    plans: publicPlans(),
  });
}

async function createCheckoutSession(req, res) {
  if (!stripe) {
    return res.status(400).json({
      success: false,
      message: "Stripe is not configured yet.",
    });
  }

  const plan = sanitizePlainText(req.body.plan, 30).toLowerCase();
  const priceId = getPriceIdForPlan(plan);

  if (!priceId) {
    return res.status(400).json({
      success: false,
      message: "Selected plan is not billable or is not configured.",
    });
  }

  let customerId = req.user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name,
      metadata: { userId: String(req.user._id) },
    });
    customerId = customer.id;
    req.user.stripeCustomerId = customerId;
    await req.user.save();
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.FRONTEND_URL}/dashboard?billing=success`,
    cancel_url: `${env.FRONTEND_URL}/dashboard?billing=cancelled`,
    metadata: {
      userId: String(req.user._id),
      plan,
    },
  });

  return res.json({
    success: true,
    checkoutUrl: session.url,
  });
}

async function createPortalSession(req, res) {
  if (!stripe) {
    return res.status(400).json({
      success: false,
      message: "Stripe is not configured yet.",
    });
  }

  if (!req.user.stripeCustomerId) {
    return res.status(400).json({
      success: false,
      message: "No Stripe customer found for this account.",
    });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: req.user.stripeCustomerId,
    return_url: `${env.FRONTEND_URL}/dashboard`,
  });

  return res.json({
    success: true,
    portalUrl: session.url,
  });
}

async function handleStripeWebhook(req, res) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({
      success: false,
      message: "Stripe webhook is not configured.",
    });
  }

  let event;

  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        stripeCustomerId: session.customer,
        subscriptionStatus: "active",
      });
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const plan = event.type === "customer.subscription.deleted" ? "free" : getPlanFromPriceId(priceId);
    const status = event.type === "customer.subscription.deleted" ? "inactive" : subscription.status;

    await User.findOneAndUpdate(
      { stripeCustomerId: customerId },
      {
        plan,
        subscriptionStatus: status,
        stripeSubscriptionId: event.type === "customer.subscription.deleted" ? "" : subscription.id,
      }
    );
  }

  return res.json({ received: true });
}

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getPlans,
  handleStripeWebhook,
};
