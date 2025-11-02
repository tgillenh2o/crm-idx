// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, verifyEmail } = require("../controllers/auth");

router.post("/register", register);
router.get("/verify/:token", verifyEmail);

module.exports = router;
