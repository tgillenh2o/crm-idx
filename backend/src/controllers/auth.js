// src/controllers/auth.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      confirmed: false,
    });

    await newUser.save();

    // Create confirmation token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send confirmation email
    const confirmUrl = `${process.env.BACKEND_URL}/api/auth/confirm?token=${token}`;
    const html = `
      <h2>Welcome to CRM IDX, ${name}!</h2>
      <p>Please confirm your email by clicking the link below:</p>
      <a href="${confirmUrl}" target="_blank">Confirm Email</a>
      <p>This link expires in 24 hours.</p>
    `;

    await sendEmail(email, "Confirm your CRM IDX account", html);

    res.status(201).json({ message: "Registration successful. Please check your email to confirm your account." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");

    user.confirmed = true;
    await user.save();

    res.send("✅ Email confirmed! You can now log in.");
  } catch (error) {
    console.error("Email confirmation error:", error);
    res.status(400).send("Invalid or expired confirmation link.");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.confirmed) {
      return res.status(403).json({ message: "Please confirm your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};
