const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  role: { type: String, enum: ['agent','teamAdmin'], default: 'agent' },
  accepted: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invite', InviteSchema);
