const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

const env = require("./config/env");
const { handleStripeWebhook } = require("./controllers/billingController");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const adminRoutes = require("./routes/adminRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.post("/api/billing/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(mongoSanitize());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer Pro API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
