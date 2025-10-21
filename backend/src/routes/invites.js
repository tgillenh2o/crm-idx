const express = require('express');
const crypto = require('crypto');
const Invite = require('../models/Invite');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { email, teamId, role } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (req.user.role !== 'admin' && (!team.admin || team.admin.toString() !== req.user._id.toString())) return res.status(403).json({ message: 'Not allowed' });

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await Invite.create({ email, token, invitedBy: req.user._id, team: team._id, role: role || 'agent', expiresAt });

    // Optional: send email using nodemailer if SMTP configured
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      const link = `${process.env.APP_URL || 'http://localhost:3000'}/accept-invite?token=${token}`;
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `You were invited to join ${team.name}`,
        text: `Join the team: ${link}`,
        html: `<p>Join the team: <a href="${link}">${link}</a></p>`
      }).catch(err => console.warn('Email send failed', err));
    }

    res.json({ invite, inviteLink: `${process.env.APP_URL || 'http://localhost:3000'}/accept-invite?token=${token}` });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/team/:teamId', auth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (req.user.role !== 'admin' && (!team.admin || team.admin.toString() !== req.user._id.toString())) return res.status(403).json({ message: 'Not allowed' });
    const invites = await Invite.find({ team: teamId }).sort({ createdAt: -1 });
    res.json(invites);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/accept/:token', async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token });
    if (!invite) return res.status(404).json({ message: 'Invite not found' });
    if (invite.accepted) return res.status(400).json({ message: 'Invite already used' });
    if (new Date() > invite.expiresAt) return res.status(400).json({ message: 'Invite expired' });
    res.json({ email: invite.email, team: invite.team, role: invite.role });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
