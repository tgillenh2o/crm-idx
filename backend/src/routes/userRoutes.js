const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

router.get("/team", protect, adminOnly, async (req, res) => {
  const users = await User.find({ role: "teamMember" }).select("name email");
  res.json(users);
});

module.exports = router;
