const express = require("express");

const { getTemplates } = require("../controllers/templateController");

const router = express.Router();

router.get("/", getTemplates);

module.exports = router;
