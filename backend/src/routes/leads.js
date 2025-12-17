// controllers/leads.js

// Get leads assigned to the logged-in user
exports.getMyLeads = async (req, res) => {
  try {
    // TODO: Replace with real DB fetch
    res.json({
      message: "Fetched my leads",
      leads: [],
      userId: req.user.id,
    });
  } catch (err) {
    console.error("GET MY LEADS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leads in the "pond"
exports.getLeadPond = async (req, res) => {
  try {
    // TODO: Replace with real DB fetch
    res.json({
      message: "Fetched lead pond",
      leads: [],
    });
  } catch (err) {
    console.error("GET LEAD POND ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    // TODO: Replace with real DB create logic
    res.json({
      message: "Lead created successfully",
      lead: req.body,
    });
  } catch (err) {
    console.error("CREATE LEAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Move a lead to the "pond"
exports.moveToPond = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Replace with real DB update
    res.json({
      message: `Lead ${id} moved to pond`,
    });
  } catch (err) {
    console.error("MOVE TO POND ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
