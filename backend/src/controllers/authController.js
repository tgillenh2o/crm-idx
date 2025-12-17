const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Team = require("../models/Team");
const { signToken } = require("../utils/jwt");

exports.register = async (req, res) => {
 try{
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "admin",
  });

  // Create team automatically for first admin
  const team = await Team.create({
    name: `${name}'s Team`,
    admin: user._id,
  });

  user.teamId = team._id;
  await user.save();

  const token = signToken(user);
  res.json({ token, role: user.role });
 }
};

exports.login = async (req, res) => {
 try{
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid login" });

  const token = signToken(user);
  res.json({ token, role: user.role });
 }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("teamId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

