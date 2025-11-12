// src/routes/leads.js
const express = require("express");
const router = express.Router();
const { getLeads } = require("../controllers/leads");

router.get("/", getLeads);

module.exports = router;
