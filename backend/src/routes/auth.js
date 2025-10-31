const express = require("express");
const { register, login, confirmEmail } = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirm/:token", confirmEmail);

module.exports = router;
