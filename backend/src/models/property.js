const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  listingId: { type: String, index: true },
  title: String,
  description: String,
  address: {
    line: String, city: String, state: String, postalCode: String, lat: Number, lng: Number
  },
  price: Number,
  beds: Number,
  baths: Number,
  sqft: Number,
  photos: [String],
  status: String,
  source: String,
  raw: Object
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
