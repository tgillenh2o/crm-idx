const Lead = require("../models/Lead");

// Get leads
exports.getLeads = async (req, res) => {
  const filter =
    req.user.role === "teamAdmin"
      ? {}
      : { owner: req.user._id };

  const leads = await Lead.find(filter);
  res.json(leads);
};

// Get lead pond
exports.getPond = async (req, res) => {
  const leads = await Lead.find({ status: "pond" });
  res.json(leads);
};

// Move lead to pond
exports.moveToPond = async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });

  lead.owner = null;
  lead.status = "pond";
  await lead.save();

  res.json({ message: "Moved to pond" });
};

// Assign lead (admin only)
exports.assignLead = async (req, res) => {
  const { userId } = req.body;
  const lead = await Lead.findById(req.params.id);

  lead.owner = userId;
  lead.status = "assigned";
  await lead.save();

  res.json({ message: "Lead assigned" });
};

// Delete lead (admin only)
exports.deleteLead = async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Lead deleted" });
};
