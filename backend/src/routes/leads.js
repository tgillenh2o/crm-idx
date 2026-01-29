const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Lead = require("../models/Lead");
const isAdmin = require("../middleware/isAdmin");

/* ================== PATCH LEAD GENERAL UPDATE ================== */
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const { name, email, phone, status, assignedTo } = req.body;

    // Members cannot reassign leads
    if (!req.user.role === "teamAdmin" && assignedTo && assignedTo !== lead.assignedTo) {
      return res.status(403).json({ message: "Not allowed to reassign lead" });
    }

    // Update fields if provided
    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email.trim().toLowerCase();
    if (phone !== undefined) lead.phone = phone;
    if (status !== undefined) lead.status = status;
    if (assignedTo !== undefined && req.user.role === "teamAdmin") lead.assignedTo = assignedTo;

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("PATCH lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== PATCH LEAD STATUS ================== */
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = status; // now supports any status from frontend
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== CLAIM LEAD ================== */
router.patch("/:id/claim", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    if (lead.assignedTo !== "POND") return res.status(400).json({ message: "Lead already assigned" });

    lead.assignedTo = req.user.email;
    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("CLAIM lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== RETURN TO POND ================== */
router.patch("/:id/return", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (req.user.role !== "teamAdmin" && lead.assignedTo !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }

    lead.assignedTo = "POND";
    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("RETURN lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== INTERACTIONS ================== */
router.post("/:id/interactions", verifyToken, async (req, res) => {
  try {
    const { type, note } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.interactions = lead.interactions || [];
    lead.interactions.push({
      type,
      note,
      createdBy: req.user.name || req.user.email,
      date: new Date(),
    });

    await lead.save();
    res.json({ interactions: lead.interactions });
  } catch (err) {
    console.error("INTERACTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
