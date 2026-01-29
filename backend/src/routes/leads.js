const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Lead = require("../models/Lead");
const isAdmin = require("../middleware/isAdmin");


/* ================== GET LEADS ================== */
router.get("/", verifyToken, async (req, res) => {
  try {
    let leads;

    if (req.user.role === "teamAdmin") {
      leads = await Lead.find().sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({
        $or: [
          { assignedTo: req.user.email },
          { assignedTo: "POND" },
          { assignedTo: "UNASSIGNED" },
          { assignedTo: { $exists: false } },
        ],
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

/* ================== MEMBER CLAIM LEAD ================== */
router.patch("/:id/claim", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Only allow claiming pond leads
    if (lead.assignedTo !== "POND") {
      return res.status(400).json({ message: "Lead already assigned" });
    }

    lead.assignedTo = req.user.email;
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("CLAIM lead error:", err);
    res.status(500).json({ message: "Server error" });
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

// PATCH /api/leads/:id/return
router.patch("/:id/return", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only allow owner to return
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
router.patch("/:id/reassign", verifyToken, isAdmin, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.assignedTo = assignedTo?.trim() || "POND";
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("REASSIGN lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/*================== INTERACTIONS ================*/
// routes/leads.js
router.post("/:id/interactions", verifyToken, async (req, res) => {
  try {
    const { type, note } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const interaction = {
      type,
      note,
      createdBy: req.user.name || req.user.email,
      date: new Date(),
    };

    lead.interactions = lead.interactions || [];
    lead.interactions.push(interaction);
    await lead.save();

    res.json({ interactions: lead.interactions });
  } catch (err) {
    console.error("INTERACTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE LEAD STATUS
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.status = status;
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
