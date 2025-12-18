const mongoose = require("mongoose");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["teamAdmin", "teamMember"], default: "teamMember" },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});



userSchema.pre("save", function (next) {
  if (!this.verificationToken) {
    this.verificationToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
