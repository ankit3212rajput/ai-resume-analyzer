const express = require("express");
const { body } = require("express-validator");

const { getMe, googleLogin, login, register } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const handleValidation = require("../middleware/validate");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters."),
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password")
      .isLength({ min: 6, max: 64 })
      .withMessage("Password must be between 6 and 64 characters."),
    handleValidation,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").isLength({ min: 6, max: 64 }).withMessage("Password is required."),
    handleValidation,
  ],
  login
);

router.post(
  "/google",
  [body("token").isString().notEmpty().withMessage("Google token is required."), handleValidation],
  googleLogin
);

router.get("/me", protect, getMe);

module.exports = router;
