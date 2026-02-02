const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");


/* ================== GET LEADS ================== */
router.get("/", verifyToken, async (req, res) => {
  try {
    let leads;
    if (req.user.role === "teamAdmin") {
      leads = await Lead.find().sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({
        $or: [{ assignedTo: req.user.email }, { assignedTo: "POND" }],
      }).sort({ createdAt: -1 });
    }
    res.json(leads);
  } catch (err) {
    console.error("GET leads error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== POST NEW LEAD ================== */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ message: "Missing required info" });

    const normalizedEmail = email.trim().toLowerCase();
    const existingLead = await Lead.findOne({ email: normalizedEmail });
    if (existingLead)
      return res.status(400).json({ message: "Lead already exists" });

    const lead = new Lead({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      status: status || "New",
      assignedTo:
        req.user.role === "teamAdmin"
          ? assignedTo?.trim() || "POND"
          : req.user.email,
      interactions: [],
    });

    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    console.error("POST lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== PATCH LEAD GENERAL UPDATE ================== */
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const { name, email, phone, status, assignedTo } = req.body;

    // Members cannot reassign leads
    if (assignedTo && req.user.role !== "teamAdmin") {
      return res.status(403).json({ message: "Not allowed to reassign lead" });
    }

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email.trim().toLowerCase();
    if (phone !== undefined) lead.phone = phone;
    if (status !== undefined) lead.status = status;
    if (assignedTo !== undefined && req.user.role === "teamAdmin")
      lead.assignedTo = assignedTo;

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("PATCH lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== PATCH STATUS ================== */
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = status;
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
    if (lead.assignedTo !== "POND")
      return res.status(400).json({ message: "Lead already assigned" });

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

router.delete("/:id", auth, async (req, res) => {
  if (!["teamAdmin"].includes(req.user.role)) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  await Lead.findByIdAndDelete(req.params.id);
  res.json({ msg: "Lead deleted" });
});


module.exports = router;
