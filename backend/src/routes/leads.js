const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { authMiddleware, requireRole } = require("../middleware/auth");

/**
 * GET LEADS
 * - Admin: all leads
 * - Member: only their leads
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let leads;

    if (req.user.role === "teamAdmin") {
      leads = await Lead.find();
    } else {
      leads = await Lead.find({
        $or: [
          { assignedTo: req.user.id },
          { assignedTo: null } // lead pond
        ]
      });
    }

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE LEAD
 * ❌ Members blocked
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["teamAdmin"]),
  async (req, res) => {
    try {
      await Lead.findByIdAndDelete(req.params.id);
      res.json({ message: "Lead deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
