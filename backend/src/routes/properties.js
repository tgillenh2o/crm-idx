// backend/src/routes/properties.js
const express = require('express');
const router = express.Router();

// ✅ Import models
const Property = require('../models/Property');
const User = require('../models/User');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new property
router.post('/', async (req, res) => {
  try {
    const { address, owner } = req.body;
    const property = new Property({ address, owner });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
