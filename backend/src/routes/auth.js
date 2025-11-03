const express = require("express");
const router = express.Router();
const { register, login, verify } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verify); // email verification link: /verify?email=...

module.exports = router;
