const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  type: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  status: { type: String, enum: ["active", "pond"], default: "active" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Lead", leadSchema);
