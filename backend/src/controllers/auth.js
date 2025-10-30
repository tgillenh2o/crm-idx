const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate confirmation token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm?token=${token}`;

    await transporter.sendMail({
      from: `"CRM IDX" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Confirm your email",
      html: `<p>Hello ${user.name},</p>
             <p>Click <a href="${confirmUrl}">here</a> to confirm your email.</p>`,
    });

    res.status(201).json({ message: "Registration successful! Check your email to confirm." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { confirmed: true });
    res.send("Email confirmed! You can now log in.");
  } catch (err) {
    console.error("Email confirmation error:", err);
    res.status(400).send("Invalid or expired token");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.confirmed) return res.status(400).json({ message: "Please confirm your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
