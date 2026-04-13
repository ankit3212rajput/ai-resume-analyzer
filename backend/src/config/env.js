const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env"), override: false });

const siteUrl = process.env.FRONTEND_URL || "http://localhost:3000";

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-resume-analyzer-pro",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  FRONTEND_URL: siteUrl,
  ALLOWED_ORIGINS: siteUrl.split(",").map((origin) => origin.trim()),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID || "",
  STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID || "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
};
