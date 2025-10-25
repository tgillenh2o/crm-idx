// backend/src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
