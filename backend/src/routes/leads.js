const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Lead = require("../models/Lead");
const isAdmin = require("../middleware/isAdmin");


/* ================== GET LEADS ================== */
router.get("/", verifyToken, async (req, res) => {
  try {
    const leads =
      req.user.role === "teamAdmin"
        ? await Lead.find().sort({ createdAt: -1 })
        : await Lead.find({ assignedTo: req.user.email }).sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    console.error("GET leads error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== POST NEW LEAD ================== */
router.post("/", verifyToken, async (req, res) => {
  console.log("🔥 POST /api/leads HIT");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);

  try {
    const { name, email, phone, status, assignedTo } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required lead info" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingLead = await Lead.findOne({ email: normalizedEmail });
    if (existingLead) {
      return res.status(400).json({ message: "Lead already exists" });
    }

    let assignedToFinal =
      req.user.role === "teamAdmin"
        ? assignedTo?.trim() || "POND"
        : req.user.email;

    const lead = new Lead({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      status: status || "New",
      assignedTo: assignedToFinal,
      interactions: [],
    });

    const savedLead = await lead.save();

    console.log("✅ LEAD SAVED:", savedLead);

    res.status(201).json(savedLead);
  } catch (err) {
    console.error("POST lead error:", err);
    res.status(500).json({ message: "Failed to add lead" });
  }
});

/* ================== PATCH LEAD ================== */
router.patch("/:id/assign", verifyToken, isAdmin, async (req, res) => {
  const { userId } = req.body;

  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  lead.assignedTo = userId || null;
  await lead.save();

  const populated = await Lead.findById(lead._id)
    .populate("assignedTo", "name email");

  res.json(populated);
});


/* ================== DELETE LEAD ================== */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "teamAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ================== ADMIN REASSIGN LEAD ================== */
router.patch("/:id/assign", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "teamAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { assignedTo } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.assignedTo = assignedTo && assignedTo.trim() !== ""
      ? assignedTo
      : "UNASSIGNED";

    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("ASSIGN lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
