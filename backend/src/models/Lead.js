const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    source: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // null = lead pond
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
