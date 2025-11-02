// src/controllers/auth.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/email");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = new User({ name, email, password: hashedPassword, verified: false });
    await user.save();

    // send verification email
    const verificationUrl = `https://crm-idx-frontend.onrender.com/verified?email=${encodeURIComponent(email)}`;
    await sendEmail(email, verificationUrl);

    res.status(201).json({ message: "Registered successfully! Check your email to verify." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};
