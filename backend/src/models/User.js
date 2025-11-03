const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String }
});

// Generate a verification token before saving a new user
userSchema.pre("save", function(next) {
  if (!this.verifyToken) {
    this.verifyToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
