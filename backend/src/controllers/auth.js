const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require("../services/email");

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      confirmed: false, // email confirmation pending
    });

    await user.save();

    // Generate confirmation token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const confirmUrl = `${process.env.CLIENT_URL}/confirm/${token}`;

    await sendConfirmationEmail(email, confirmUrl);

    res.status(201).json({ message: "Registration successful! Please check your email to confirm." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.confirmed) return res.status(403).json({ message: "Please confirm your email before logging in" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).send("Invalid token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).send("User not found");
    if (user.confirmed) return res.send("Email already confirmed");

    user.confirmed = true;
    await user.save();

    res.send("Email successfully confirmed! You can now log in.");
  } catch (err) {
    console.error("Email confirmation error:", err);
    res.status(400).send("Invalid or expired token");
  }
};
