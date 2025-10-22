const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");

// Get leads
router.get("/", auth, async (req, res) => {
  try {
    let leads;
    if (req.user.role === "teamAdmin") {
      leads = await Lead.find({ teamId: req.user.teamId });
    } else {
      leads = await Lead.find({ ownerId: req.user._id });
    }
    res.json({ data: leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create lead
router.post("/", auth, async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      ownerId: req.user._id,
      teamId: req.user.teamId,
    });
    res.json({ message: "Lead created", data: lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
