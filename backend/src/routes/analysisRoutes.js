const express = require("express");
const { body } = require("express-validator");

const { coverLetter, getHistory, jobMatch, rewriteBullet, uploadResume } = require("../controllers/analysisController");
const { protect } = require("../middleware/auth");
const { uploadLimiter } = require("../middleware/rateLimiter");
const upload = require("../middleware/upload");
const handleValidation = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/history", getHistory);
router.post("/upload", uploadLimiter, upload.single("resume"), uploadResume);

router.post(
  "/job-match",
  [
    body("jobDescription")
      .isString()
      .isLength({ min: 30, max: 12000 })
      .withMessage("Job description must be between 30 and 12000 characters."),
    handleValidation,
  ],
  jobMatch
);

router.post(
  "/rewrite",
  [
    body("bulletPoint")
      .isString()
      .isLength({ min: 8, max: 300 })
      .withMessage("Bullet point must be between 8 and 300 characters."),
    handleValidation,
  ],
  rewriteBullet
);

router.post(
  "/cover-letter",
  [
    body("jobTitle").isString().isLength({ min: 2, max: 80 }).withMessage("Job title is required."),
    body("companyName").isString().isLength({ min: 2, max: 80 }).withMessage("Company name is required."),
    handleValidation,
  ],
  coverLetter
);

module.exports = router;
