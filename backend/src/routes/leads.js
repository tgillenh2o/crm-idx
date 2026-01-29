const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const Lead = require("../models/Lead");

/* GET LEADS */
router.get("/", verifyToken, async (req, res) => {
  try {
    const leads =
      req.user.role === "teamAdmin"
        ? await Lead.find().sort({ createdAt: -1 })
        : await Lead.find({
            $or: [
              { assignedTo: req.user.email },
              { assignedTo: "POND" },
              { assignedTo: "UNASSIGNED" },
              { assignedTo: { $exists: false } },
            ],
          }).sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    console.error("GET leads error:", err.message, err.errors);
    res.status(500).json({ message: err.message, errors: err.errors });
  }
});

/* POST NEW LEAD */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ message: "Missing required lead info" });

    const normalizedEmail = email.trim().toLowerCase();
    const existingLead = await Lead.findOne({ email: normalizedEmail });
    if (existingLead)
      return res.status(400).json({ message: "Lead already exists" });

    const lead = new Lead({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      status: status || "New",
      assignedTo: req.user.role === "teamAdmin" ? assignedTo || "POND" : req.user.email,
      interactions: [],
    });

    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    console.error("POST lead error:", err.message, err.errors);
    res.status(500).json({ message: err.message, errors: err.errors });
  }
});

/* PATCH LEAD STATUS */
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = status; // Mongoose enum ensures only valid values
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err.message, err.errors);
    res.status(500).json({ message: err.message, errors: err.errors });
  }
});

/* POST INTERACTIONS */
router.post("/:id/interactions", verifyToken, async (req, res) => {
  try {
    const { type, note } = req.body;
    if (!type) return res.status(400).json({ message: "Interaction type required" });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const interaction = {
      type: type.toLowerCase(),
      note: note || "",
      createdBy: req.user.name || req.user.email,
      date: new Date(),
    };

    lead.interactions.push(interaction);
    await lead.save();

    res.json({ interactions: lead.interactions });
  } catch (err) {
    console.error("INTERACTION ERROR:", err.message, err.errors);
    res.status(500).json({ message: err.message, errors: err.errors });
  }
});

module.exports = router;
