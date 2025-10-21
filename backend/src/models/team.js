const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  bio: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  logoUrl: String,
  settings: {
    leadRouting: { type: String, enum: ['roundrobin','teamAdmin','manual'], default: 'teamAdmin' },
    lastAssigned: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
