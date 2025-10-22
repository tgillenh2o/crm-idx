const express = require('express');
const Lead = require('../models/Lead');
const Team = require('../models/team');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/capture', async (req, res) => {
  try {
    const { name, email, phone, message, teamId } = req.body;
    if (!teamId) return res.status(400).json({ message: 'teamId required' });
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const lead = new Lead({ name, email, phone, message, team: team._id });

    // routing logic
    if (team.settings?.leadRouting === 'roundrobin') {
      const members = team.members || [];
      if (members.length) {
        const idx = (team.settings.lastAssigned || 0) % members.length;
        lead.assignedTo = members[idx];
        team.settings.lastAssigned = idx + 1;
        await team.save();
      }
    } else if (team.settings?.leadRouting === 'teamAdmin') {
      lead.assignedTo = team.admin;
    }

    await lead.save();
    res.json({ ok: true, lead });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/team/:teamId', auth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (req.user.role !== 'admin' && (!req.user.team || req.user.team.toString() !== teamId)) return res.status(403).json({ message: 'Not authorized' });
    const leads = await Lead.find({ team: teamId }).populate('assignedTo', 'name email');
    res.json(leads);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:leadId', auth, async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: 'Not found' });

    // allow assigned user, team admin, or global admin
    if (req.user.role !== 'admin' && (!lead.assignedTo || lead.assignedTo.toString() !== req.user._id.toString())) {
      const team = await Team.findById(lead.team);
      if (!team || (team.admin && team.admin.toString() !== req.user._id.toString())) {
        return res.status(403).json({ message: 'Not allowed' });
      }
    }

    Object.assign(lead, req.body);
    await lead.save();
    res.json(lead);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
