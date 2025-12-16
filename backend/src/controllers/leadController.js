const Lead = require("../models/Lead");

// CREATE LEAD
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      owner: req.user.id,
      status: "assigned",
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: "Failed to create lead" });
  }
};

// GET MY LEADS
exports.getMyLeads = async (req, res) => {
  const leads = await Lead.find({
    owner: req.user.id,
    status: "assigned",
  });
  res.json(leads);
};

// GET LEAD POND
exports.getLeadPond = async (req, res) => {
  const leads = await Lead.find({ status: "pond" });
  res.json(leads);
};

// MOVE LEAD TO POND
exports.moveToPond = async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) return res.status(404).json({ message: "Lead not found" });

  // Team members can only move THEIR leads
  if (
    req.user.role !== "admin" &&
    lead.owner.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  lead.status = "pond";
  lead.owner = null;
  await lead.save();

  res.json(lead);
};

// DELETE LEAD (ADMIN ONLY)
exports.deleteLead = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Lead deleted" });
};
