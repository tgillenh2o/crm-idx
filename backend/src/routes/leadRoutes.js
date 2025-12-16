const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Lead = require("../models/Lead");
const adminOnly = require("../middleware/admin");
const User = require("../models/User");


// GET pond leads
router.get("/pond", protect, async (req, res) => {
  const leads = await Lead.find({ status: "pond" });
  res.json(leads);
});

// GET my leads
router.get("/mine", protect, async (req, res) => {
  const leads = await Lead.find({ assignedTo: req.user.id });
  res.json(leads);
});

// CLAIM lead
router.put("/:id/claim", protect, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  if (lead.status !== "pond")
    return res.status(400).json({ message: "Lead already claimed" });

  lead.status = "assigned";
  lead.assignedTo = req.user.id;
  await lead.save();

  res.json({ message: "Lead claimed" });
});

// ADMIN: assign or reassign lead
router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  const { userId } = req.body;

  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  lead.assignedTo = user._id;
  lead.status = "assigned";
  await lead.save();

  res.json({ message: "Lead assigned" });
});


module.exports = router;
