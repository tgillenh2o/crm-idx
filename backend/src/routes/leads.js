const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Lead = require("../models/Lead");

// ================== GET LEADS ==================
router.get("/", auth, async (req, res) => {
  try {
    let leads;

    if (req.user.role === "teamAdmin") {
      leads = await Lead.find().sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({ assignedTo: req.user.email }).sort({ createdAt: -1 });
    }

    res.json(leads);
  } catch (err) {
    console.error("GET leads error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== POST NEW LEAD ==================
// ================== POST NEW LEAD ==================
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo: requestedAssignedTo } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required lead info" });
    }

    // Decide who this lead should be assigned to
    let assignedToFinal;
    if (req.user.role === "teamAdmin") {
      // Admin can assign lead or default to POND
      assignedToFinal = requestedAssignedTo || "POND";
    } else {
      // Members always assign to themselves
      assignedToFinal = req.user.email;
    }

    const lead = new Lead({
      name,
      email,
      phone,
      status: status || "New",
      assignedTo: assignedToFinal,
      interactions: [],
    });

    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    console.error("Add lead error:", err);
    res.status(500).json({ message: "Failed to add lead" });
  }
});





// ================== PATCH LEAD (Status update) ==================
router.patch("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only assigned user or admin can update
    if (req.user.role !== "teamAdmin" && lead.assignedTo !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { status } = req.body;
    if (status) lead.status = status;

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("PATCH lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== DELETE LEAD (Admin only) ==================
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "teamAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// POST /api/leads/:id/interactions
router.post("/:id/interactions", auth, async (req, res) => {
  try {
    const { type, note } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only admin or assigned member can log
    if (req.user.role !== "teamAdmin" && lead.assignedTo !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }

    lead.interactions.push({
      type,
      note,
      createdBy: req.user.email,
      date: new Date(),
    });

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("Add interaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
