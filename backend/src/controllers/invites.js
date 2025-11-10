const Invite = require("../models/Invite");
const User = require("../models/User");
const Team = require("../models/Team");
const crypto = require("crypto");
const { sendEmail } = require("../services/email");

// Create an invite (admin only)
exports.createInvite = async (req, res) => {
  try {
    const { email, role, teamId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const token = crypto.randomBytes(32).toString("hex");

    const invite = new Invite({ email, role, teamId, token });
    await invite.save();

    const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite/${token}`;
    await sendEmail(email, `You are invited! Click here to join: ${inviteUrl}`);

    res.status(201).json({ message: "Invite sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invite" });
  }
};

// Accept an invite
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(400).json({ message: "Invalid or expired invite" });

    const user = await User.findOne({ email: invite.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = invite.role;
    user.teamId = invite.teamId;
    await user.save();

    await Invite.deleteOne({ _id: invite._id });
    res.json({ message: "Invite accepted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept invite" });
  }
};
