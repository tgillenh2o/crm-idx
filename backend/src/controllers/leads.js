const Lead = require("../models/Lead");

exports.getMyLeads = async (req, res) => {
  const leads = await Lead.find({ owner: req.user._id, status: "active" });
  res.json(leads);
};

exports.getLeadPond = async (req, res) => {
  const leads = await Lead.find({ status: "pond" });
  res.json(leads);
};

exports.createLead = async (req, res) => {
  const { name, email, phone, type } = req.body;
  const lead = await Lead.create({ name, email, phone, type, owner: req.user._id });
  res.json(lead);
};

exports.moveToPond = async (req, res) => {
  const { id } = req.params;
  const lead = await Lead.findById(id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  // Only owner or admin can move
  if (req.user.role !== "teamAdmin" && !lead.owner.equals(req.user._id))
    return res.status(403).json({ message: "Forbidden" });

  lead.status = "pond";
  await lead.save();
  res.json({ message: "Lead moved to pond" });
};
