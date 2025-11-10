const express = require("express");
const router = express.Router();
const { register, verifyEmail } = require("../controllers/auth");

// POST /api/auth/register
router.post("/register", register);

// GET /api/auth/verify/:token
router.get("/verify/:token", verifyEmail);

module.exports = router;
