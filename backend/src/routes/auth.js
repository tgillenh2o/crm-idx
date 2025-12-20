// src/routes/auth.js
const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const express = require("express");
const router = express.Router();
const { getMe } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
