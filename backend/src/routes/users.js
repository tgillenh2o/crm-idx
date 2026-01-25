const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

// GET all team members (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find(); // make sure no filter like { role: 'teamMember' }
    res.json(users);
  } catch (err) {
    console.error("GET users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
