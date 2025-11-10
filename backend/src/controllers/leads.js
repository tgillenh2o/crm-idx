const Lead = require("../models/Lead");
const Team = require("../models/Team");
const User = require("../models/User");

// -----------------------------
// CREATE LEAD
// -----------------------------
exports.createLead = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, notes, type, assignedTo } = req.body;
    const user = req.user; // set by JWT auth middleware

    const lead = new Lead({
      firstName,
      lastName,
      email,
      phone,
      notes,
      type, // buyer or seller
      assignedTo: assignedTo || (user.role === "independent" ? user._id : null),
      team: user.team || null,
      createdBy: user._id,
    });

    await lead.save();
    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (err) {
    console.error("❌ Create lead error:", err);
    res.status(500).json({ message: "Failed to create lead" });
  }
};

// -----------------------------
// GET LEADS
// -----------------------------
exports.getLeads = async (req, res) => {
  try {
    const user = req.user;
    let leads;

    if (user.role === "independent") {
      // Only their own leads
      leads = await Lead.find({ assignedTo: user._id });
    } else if (user.role === "teamMember") {
      // Assigned to them OR in team pond (unassigned leads for team)
      leads = await Lead.find({
        $or: [
          { assignedTo: user._id },
          { team: user.team, assignedTo: null }
        ]
      });
    } else if (user.role === "teamAdmin") {
      // All team leads
      leads = await Lead.find({ team: user.team });
    }

    res.status(200).json({ leads });
  } catch (err) {
    console.error("❌ Get leads error:", err);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

// -----------------------------
// GET LEAD POND (TEAM UNASSIGNED)
// -----------------------------
exports.getLeadPond = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "teamAdmin" && user.role !== "teamMember") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const pondLeads = await Lead.find({
      team: user.team,
      assignedTo: null
    });

    res.status(200).json({ leads: pondLeads });
  } catch (err) {
    console.error("❌ Get lead pond error:", err);
    res.status(500).json({ message: "Failed to fetch lead pond" });
  }
};

// -----------------------------
// UPDATE LEAD
// -----------------------------
exports.updateLead = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only assigned user or team admin can update
    if (
      user.role === "independent" && !lead.assignedTo.equals(user._id) ||
      user.role === "teamMember" && !lead.assignedTo.equals(user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(lead, updates);
    await lead.save();

    res.status(200).json({ message: "Lead updated", lead });
  } catch (err) {
    console.error("❌ Update lead error:", err);
    res.status(500).json({ message: "Failed to update lead" });
  }
};

// -----------------------------
// ASSIGN LEAD (TEAM ADMIN)
// -----------------------------
exports.assignLead = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params; // lead id
    const { assignedTo } = req.body; // user id of team member

    if (user.role !== "teamAdmin") return res.status(403).json({ message: "Forbidden" });

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Check that assignedTo is part of the team
    const member = await User.findOne({ _id: assignedTo, team: user.team });
    if (!member) return res.status(400).json({ message: "Invalid team member" });

    lead.assignedTo = assignedTo;
    await lead.save();

    res.status(200).json({ message: "Lead assigned", lead });
  } catch (err) {
    console.error("❌ Assign lead error:", err);
    res.status(500).json({ message: "Failed to assign lead" });
  }
};
