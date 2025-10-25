// backend/src/routes/leads.js
const express = require('express');
const router = express.Router();

// ✅ Import models
const Lead = require('../models/Lead');
const User = require('../models/User');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo', 'name email');
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, assignedTo } = req.body;
    const lead = new Lead({ name, email, assignedTo });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
