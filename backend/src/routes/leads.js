const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // use auth consistently
const Lead = require("../models/Lead");

// ================== GET LEADS ==================
router.get("/", auth, async (req, res) => {
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

// ================== POST NEW LEAD ==================
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo: requestedAssignedTo } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required lead info" });
    }

    // Prevent duplicate leads by email
    const existingLead = await Lead.findOne({ email: email.trim().toLowerCase() });
    if (existingLead) {
      return res.status(400).json({ message: "Lead with this email already exists" });
    }

    // Assign lead
    let assignedToFinal;
    if (req.user.role === "teamAdmin") {
      assignedToFinal = requestedAssignedTo && requestedAssignedTo.trim() !== "" ? requestedAssignedTo : "POND";
    } else {
      assignedToFinal = req.user.email;
    }

    const lead = new Lead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
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

    if (req.user.role !== "teamAdmin" && lead.assignedTo !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.body.status) lead.status = req.body.status;
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
    if (req.user.role !== "teamAdmin") return res.status(403).json({ message: "Forbidden" });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== POST INTERACTION ==================
router.post("/:id/interactions", auth, async (req, res) => {
  try {
    const { type, note } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

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
