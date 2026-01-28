const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

// Update current user
router.patch("/me", verifyToken, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
