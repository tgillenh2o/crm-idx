const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  status: { type: String, enum: ["pond", "assigned"], default: "pond" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  history: [
    {
      action: String, // e.g., "claimed", "moved to pond", "assigned"
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);

router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  const { userId } = req.body;

  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  lead.assignedTo = user._id;
  lead.status = "assigned";
  lead.history.push({
    action: `assigned to ${user.name}`,
    by: req.user.id,
  });

  await lead.save();
  res.json({ message: "Lead assigned", lead });
});

router.put("/:id/claim", protect, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  if (lead.status !== "pond")
    return res.status(400).json({ message: "Lead not in pond" });

  lead.assignedTo = req.user.id;
  lead.status = "assigned";
  lead.history.push({
    action: "claimed from pond",
    by: req.user.id,
  });

  await lead.save();
  res.json({ message: "Lead claimed", lead });
});

router.get("/:id/history", protect, async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate("history.by", "name email");

  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json(lead.history);
});
