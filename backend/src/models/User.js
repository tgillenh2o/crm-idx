const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["teamAdmin", "teamMember"],
    default: "teamMember"
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
});

module.exports = mongoose.model("User", UserSchema);
