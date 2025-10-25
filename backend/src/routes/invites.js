// backend/src/routes/invites.js
const express = require('express');
const router = express.Router();

// ✅ Import models
const Invite = require('../models/Invite');
const User = require('../models/User');

// Get all invites
router.get('/', async (req, res) => {
  try {
    const invites = await Invite.find().populate('sentBy', 'name email');
    res.json(invites);
  } catch (err) {
    console.error('Error fetching invites:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new invite
router.post('/', async (req, res) => {
  try {
    const { email, sentBy } = req.body;
    const invite = new Invite({ email, sentBy });
    await invite.save();
    res.status(201).json(invite);
  } catch (err) {
    console.error('Error creating invite:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
