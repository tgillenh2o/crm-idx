// src/controllers/leads.js
const Lead = require("../models/Lead");

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (err) {
    console.error("❌ Error fetching leads:", err);
    res.status(500).json({ message: "Server error loading leads" });
  }
};
