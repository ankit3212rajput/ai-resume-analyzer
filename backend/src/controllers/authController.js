const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const env = require("../config/env");
const User = require("../models/User");
const { getPlanConfig, getUsageSnapshot, syncUsageWindow } = require("../utils/planConfig");
const { sanitizePlainText } = require("../utils/sanitize");

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function createToken(userId) {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function serializeUser(user) {
  syncUsageWindow(user);
  const plan = getPlanConfig(user.plan);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
    plan: user.plan,
    planDetails: {
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      adsEnabled: plan.adsEnabled,
      features: plan.features,
    },
    subscriptionStatus: user.subscriptionStatus,
    usage: getUsageSnapshot(user),
    createdAt: user.createdAt,
  };
}

async function register(req, res) {
  const name = sanitizePlainText(req.body.name, 80);
  const email = sanitizePlainText(req.body.email, 120).toLowerCase();
  const password = String(req.body.password || "");

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: env.ADMIN_EMAIL && email === env.ADMIN_EMAIL.toLowerCase() ? "admin" : "user",
  });

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    token: createToken(user._id),
    user: serializeUser(user),
  });
}

async function login(req, res) {
  const email = sanitizePlainText(req.body.email, 120).toLowerCase();
  const password = String(req.body.password || "");

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  return res.json({
    success: true,
    message: "Login successful",
    token: createToken(user._id),
    user: serializeUser(user),
  });
}

async function googleLogin(req, res) {
  if (!googleClient) {
    return res.status(400).json({
      success: false,
      message: "Google login is not configured",
    });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: req.body.token,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = sanitizePlainText(payload.email, 120).toLowerCase();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Google account email is required to continue.",
    });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: sanitizePlainText(payload.name || "Google User", 80),
      email,
      googleId: payload.sub,
      picture: payload.picture || "",
      role: env.ADMIN_EMAIL && email === env.ADMIN_EMAIL.toLowerCase() ? "admin" : "user",
    });
  } else {
    user.googleId = payload.sub;
    user.picture = payload.picture || user.picture;
    await user.save();
  }

  return res.json({
    success: true,
    message: "Google login successful",
    token: createToken(user._id),
    user: serializeUser(user),
  });
}

async function getMe(req, res) {
  return res.json({
    success: true,
    user: serializeUser(req.user),
  });
}

module.exports = {
  getMe,
  googleLogin,
  login,
  register,
  serializeUser,
};
