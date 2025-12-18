// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Team = require("../models/Team");
const { signToken } = require("../utils/jwt");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Register request:", req.body);

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "teamAdmin", // default role for first registration; adjust as needed
    });
    console.log("User created:", user);

    // Create team automatically
    const team = await Team.create({
      name: `${name}'s Team`,
      admin: user._id,
    });
    console.log("Team created:", team);

    // Link user to team
    user.teamId = team._id;
    await user.save();
    console.log("User updated with teamId");

    // Sign token
    const token = signToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid login" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid login" });
    }

    const token = signToken(user);
    console.log("Login successful:", email);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
