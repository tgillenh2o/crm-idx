const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

// GET all team members (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "teamAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find({ role: "teamMember" }).select("name email");
    res.json(users);
  } catch (err) {
    console.error("GET users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
