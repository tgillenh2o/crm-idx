const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  address: String,
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Property", PropertySchema);
