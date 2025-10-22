const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  address: String,
  price: Number,
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  listingId: String,
}, { timestamps: true });

module.exports = mongoose.model("Property", PropertySchema);
