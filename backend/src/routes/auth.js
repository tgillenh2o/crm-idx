// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login, confirmEmail } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/confirm/:token", confirmEmail);

module.exports = router;
