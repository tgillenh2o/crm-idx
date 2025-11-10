// src/models/Invite.js
const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  role: { type: String, enum: ["teamMember", "teamAdmin"], default: "teamMember" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" } // expires in 7 days
});

module.exports = mongoose.model("Invite", inviteSchema);
