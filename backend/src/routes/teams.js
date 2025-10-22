const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const auth = require("../middleware/auth");

// List teams user belongs to
router.get("/", auth, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate("members", "name email role");
    res.json({ data: teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
