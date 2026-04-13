const jwt = require("jsonwebtoken");

const env = require("../config/env");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session is no longer valid",
      });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  return next();
}

module.exports = {
  adminOnly,
  protect,
};
