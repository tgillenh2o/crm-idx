const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    type: {
      type: String,
      enum: ["buyer", "seller"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    inPond: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
