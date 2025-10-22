const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Invite = require('../models/Invite');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// register (supports inviteToken)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, inviteToken } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User exists' });

    let invite = null;
    if (inviteToken) {
      invite = await Invite.findOne({ token: inviteToken, accepted: false });
      if (!invite) return res.status(400).json({ message: 'Invalid or expired invite' });
      if (new Date() > invite.expiresAt) return res.status(400).json({ message: 'Invite expired' });
      if (invite.email.toLowerCase() !== email.toLowerCase()) return res.status(400).json({ message: 'Invite email mismatch' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = invite ? invite.role : 'agent';
    const team = invite ? invite.team : undefined;
    const user = await User.create({ name, email, passwordHash, role, team });

    if (invite) {
      invite.accepted = true;
      await invite.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
