const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/confirm
router.get("/confirm", authController.confirmEmail);

module.exports = router;
