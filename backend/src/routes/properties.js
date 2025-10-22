const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const auth = require("../middleware/auth");

// Get properties
router.get("/", auth, async (req, res) => {
  try {
    let props;
    if (req.user.role === "teamAdmin") {
      props = await Property.find({ teamId: req.user.teamId });
    } else {
      props = await Property.find({ ownerId: req.user._id });
    }
    res.json({ data: props });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Sync IDX (mock)
router.post("/sync", auth, async (req, res) => {
  // Implement your IDX sync logic here
  res.json({ message: "Properties synced (mock)" });
});

module.exports = router;
