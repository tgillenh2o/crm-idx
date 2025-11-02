// src/controllers/auth.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/email");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    // Generate verification token (JWT)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Build verification URL
    const verifyUrl = `https://crm-idx.onrender.com/api/auth/verify/${token}`;

    // Send verification email
    await sendEmail(email, verifyUrl);

    res.status(200).json({ message: "Registration successful. Check your email to verify your account." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");

    user.verified = true;
    await user.save();

    res.redirect("https://crm-idx-frontend.onrender.com/verified"); // redirect to frontend verified page
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(400).send("Invalid or expired token");
  }
};
