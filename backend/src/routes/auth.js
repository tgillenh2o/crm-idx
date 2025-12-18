const router = require("express").Router();
const { register, login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth"); // destructure to get the function

router.post("/register", register);
router.post("/login", login);

// Only add this route if you actually have getMe implemented
// Otherwise remove or implement getMe
router.get("/me", verifyToken, getMe);

module.exports = router;
