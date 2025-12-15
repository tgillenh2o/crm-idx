const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = in pond
    },

    status: {
      type: String,
      enum: ["assigned", "pond"],
      default: "pond",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
