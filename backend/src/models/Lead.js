const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["call", "email", "meeting", "note"], required: true },
    note: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: String, required: true } // user email or name
  },
  { _id: false }
);

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    assignedTo: { type: String, default: "POND" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Closed"],
      default: "New",
    },
    interactions: [InteractionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
