const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendConfirmationEmail } = require("../services/email");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, confirmed: false });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || "supersecretkey", { expiresIn: "1d" });

    await sendConfirmationEmail(email, token);

    res.json({ message: "Registration successful. Check your email to confirm." });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// CONFIRM EMAIL
router.get("/confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    await User.findByIdAndUpdate(decoded.id, { confirmed: true });
    res.send("Email confirmed! You can now log in.");
  } catch {
    res.status(400).send("Invalid or expired confirmation link.");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });
    if (!user.confirmed) return res.status(403).json({ message: "Email not confirmed." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "supersecretkey", { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role, teamId: user.teamId } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
