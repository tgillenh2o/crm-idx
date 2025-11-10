// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, verifyEmail, login } = require("../controllers/auth");

// Register
router.post("/register", register);

// Verify email
router.get("/verify/:token", verifyEmail);

// Login
router.post("/login", login);

module.exports = router;
