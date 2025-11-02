const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// Register route
router.post("/register", authController.register);

// Email verification route
router.get("/verify/:token", authController.verifyEmail);

module.exports = router;
