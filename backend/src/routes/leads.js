const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Lead = require("../models/Lead");

// GET LEADS
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "teamAdmin") {
      const leads = await Lead.find();
      return res.json(leads);
    }

    const leads = await Lead.find({ assignedTo: req.user.email });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE LEAD (ADMIN ONLY)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "teamAdmin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Lead.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
