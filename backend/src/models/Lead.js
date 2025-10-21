const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['new','contacted','nurturing','closed'], default: 'new' },
  meta: Object
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
