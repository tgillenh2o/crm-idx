const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 👈 NEW
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["teamAdmin", "teamMember"],
      default: "teamMember",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
