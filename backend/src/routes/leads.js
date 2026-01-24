const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Lead = require("../models/Lead");

// GET LEADS
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json([]); // fallback empty array

    let leads = [];
    if (req.user.role === "teamAdmin") {
      leads = await Lead.find(); // admin sees all
    } else if (req.user.role === "teamMember") {
      leads = await Lead.find({ assignedTo: req.user.email }); // member sees theirs
    }

    // Always return an array
    res.json(Array.isArray(leads) ? leads : []);
  } catch (err) {
    console.error("Get leads error:", err);
    res.json([]); // fallback empty array
  }
});

// DELETE LEAD (ADMIN ONLY)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "teamAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
