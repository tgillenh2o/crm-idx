const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "agent" }, // agent/admin
  teamId: { type: String, default: null },
  confirmed: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
