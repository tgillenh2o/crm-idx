const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const Lead = require("../models/Lead");

/* GET LEADS */
router.get("/", verifyToken, async (req, res) => {
  try {
    const leads =
      req.user.role === "teamAdmin"
        ? await Lead.find().sort({ createdAt: -1 })
        : await Lead.find({
            $or: [
              { assignedTo: req.user.email },
              { assignedTo: "POND" }
            ]
          }).sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* CLAIM */
router.patch("/:id/claim", verifyToken, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });
  if (lead.assignedTo !== "POND")
    return res.status(400).json({ message: "Already claimed" });

  lead.assignedTo = req.user.email;
  await lead.save();
  res.json(lead);
});

/* RETURN */
router.patch("/:id/return", verifyToken, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });

  if (
    req.user.role !== "teamAdmin" &&
    lead.assignedTo !== req.user.email
  )
    return res.status(403).json({ message: "Forbidden" });

  lead.assignedTo = "POND";
  await lead.save();
  res.json(lead);
});

/* REASSIGN (ADMIN) */
router.patch("/:id/reassign", verifyToken, isAdmin, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });

  lead.assignedTo = req.body.assignedTo || "POND";
  await lead.save();
  res.json(lead);
});

/* STATUS */
router.patch("/:id/status", verifyToken, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });

  lead.status = req.body.status;
  await lead.save();
  res.json(lead);
});

/* INTERACTION */
router.post("/:id/interactions", verifyToken, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });

  lead.interactions.push({
    type: req.body.type,
    note: req.body.note,
    createdBy: req.user.email
  });

  await lead.save();
  res.json(lead);
});

module.exports = router;
