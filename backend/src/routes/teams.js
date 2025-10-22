const express = require('express');
const Team = require('../models/team');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// create team (teamAdmin or admin)
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin','teamAdmin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    const { name, slug, bio } = req.body;
    const team = await Team.create({ name, slug, bio, admin: req.user._id, members: [req.user._id] });
    req.user.team = team._id;
    await req.user.save();
    res.json(team);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find().populate('admin','name email').populate('members','name email role');
    res.json(teams);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/:teamId/members', auth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (req.user.role !== 'admin' && (!team.admin || team.admin.toString() !== req.user._id.toString())) return res.status(403).json({ message: 'Not allowed' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!team.members.includes(user._id)) team.members.push(user._id);
    user.team = team._id;
    await team.save();
    await user.save();
    res.json(team);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:teamId', auth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (req.user.role !== 'admin' && (!team.admin || team.admin.toString() !== req.user._id.toString())) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(team, req.body);
    await team.save();
    res.json(team);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
