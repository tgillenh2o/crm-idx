const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/email");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate email confirmation token
    const emailToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const confirmLink = `${process.env.FRONTEND_URL}/confirm?token=${emailToken}`;

    // Send confirmation email
    //await sendEmail(user.email, "Confirm your email", `Click to confirm: ${confirmLink}`);

    res.status(201).json({ message: "User registered! Please check your email." });
  } catch (err) {
    console.error("Register error:", err.message || err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.confirmed)
      return res.status(400).json({ message: "Please confirm your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Confirm email route
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.confirmed = true;
    await user.save();

    res.status(200).json({ message: "Email confirmed! You can now log in." });
  } catch (err) {
    console.error("Email confirmation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
