const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/email");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await user.save();

    // Create verification token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const confirmUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

    // ✅ Use Resend email service
    await sendEmail(
      email,
      "Confirm your email",
      `<p>Welcome, ${name}! Please confirm your email by clicking <a href="${confirmUrl}">here</a>.</p>`
    );

    console.log("✅ Confirmation email sent to:", email);

    res.status(201).json({
      message: "User registered successfully. Please check your email to confirm your account.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Example of email verification endpoint
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
