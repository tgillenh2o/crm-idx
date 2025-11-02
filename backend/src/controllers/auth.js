// src/controllers/auth.js
const User = require("../models/User");
const { sendEmail } = require("../services/email");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const newUser = await User.create({ name, email, password, confirmed: false });

    const confirmUrl = `${process.env.FRONTEND_URL}/verified?token=${newUser._id}`;
    await sendEmail(email, confirmUrl);

    res.status(200).json({ message: "Registration successful, check your email" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findById(token);
    if (!user) return res.status(400).send("Invalid token");

    user.confirmed = true;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/verified`);
  } catch (err) {
    console.error("Email confirmation error:", err);
    res.status(500).send("Server error");
  }
};
