const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: String,
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Lead", LeadSchema);
