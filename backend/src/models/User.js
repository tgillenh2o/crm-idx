const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["teamAdmin", "teamMember"], default: "teamMember" },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
});

userSchema.pre("save", function (next) {
  if (!this.verificationToken) {
    this.verificationToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
