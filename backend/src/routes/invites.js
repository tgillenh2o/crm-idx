const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Team = require("../models/Team");

// Only teamAdmin can list invites or invite users
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "teamAdmin") return res.status(403).json({ message: "Forbidden" });

  try {
    const { email, name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const team = await Team.findById(req.user.teamId);
    if (!team) return res.status(400).json({ message: "Team not found" });

    const newUser = await User.create({ name, email, teamId: team._id, role: "agent", password: "changeme123" });
    team.members.push(newUser._id);
    await team.save();

    res.json({ message: "Invite created", data: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
