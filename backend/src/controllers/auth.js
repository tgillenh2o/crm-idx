const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/email");

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false
    });

    // Build verification URL with token
    const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify/${user.verifyToken}`;

    // Send verification email
    await sendEmail(email, verifyUrl);

    return res.status(201).json({ message: "Registration successful! Check your email to verify." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(404).send("Invalid or expired verification link");

    user.verified = true;
    user.verifyToken = undefined; // Remove token after verification
    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/verified`);
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).send("Verification failed. Try again.");
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your email first." });

    return res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};
