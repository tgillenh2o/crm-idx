const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['agent','teamAdmin','admin'], default: 'agent' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  avatarUrl: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
