// src/models/Team.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Team", teamSchema);
