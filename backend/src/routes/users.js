const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET all team members (admin only)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "teamAdmin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const users = await User.find({ role: "teamMember" }).select("name email");
  res.json(users);
});

module.exports = router;
