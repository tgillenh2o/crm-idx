// backend/src/routes/teams.js
const express = require('express');
const router = express.Router();

// ✅ Import models
const Team = require('../models/Team');
const User = require('../models/User');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email');
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new team
router.post('/', async (req, res) => {
  try {
    const { name, members } = req.body;
    const team = new Team({ name, members });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
