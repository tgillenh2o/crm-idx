// src/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.get("/confirm", authController.confirmEmail);

module.exports = router;
