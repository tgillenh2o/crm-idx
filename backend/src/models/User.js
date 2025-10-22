const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["agent", "teamAdmin"], default: "agent" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
