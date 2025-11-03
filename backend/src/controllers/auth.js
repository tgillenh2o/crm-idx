const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/email");
const crypto = require("crypto");

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verifyToken,   // store token in DB
    });

    await sendEmail(email, verifyToken);

    return res.status(201).json({ message: "Registration successful! Check your email to verify." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// Verify user email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).send("Invalid verification link");

    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(404).send("User not found");

    user.verified = true;
    user.verifyToken = undefined; // remove token after verification
    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/verified`);
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).send("Verification failed. Try again.");
  }
};
