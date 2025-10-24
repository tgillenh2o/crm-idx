const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "superAdmin") return res.status(403).json({ message: "Forbidden" });
  next();
};

// === REGISTER ===
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, confirmed: false });

    const confirmToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "supersecretkey", { expiresIn: "1d" });
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm/${confirmToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Confirm your CRM + IDX account",
      html: `<p>Hello ${newUser.name},</p><p>Click <a href="${confirmUrl}">here</a> to confirm your email.</p>`,
    });

    res.json({ message: "Check your email to confirm registration." });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === EMAIL CONFIRMATION ===
router.get("/confirm/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET || "supersecretkey");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");
    user.confirmed = true;
    await user.save();
    res.send("Email confirmed! You can now log in.");
  } catch (err) {
    console.error("❌ Confirm error:", err);
    res.status(400).send("Invalid or expired confirmation link");
  }
});

// === LOGIN ===
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.confirmed) return res.status(400).json({ message: "Please confirm your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "supersecretkey", { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// === ADMIN: List all users ===
router.get("/all-users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

module.exports = router;
