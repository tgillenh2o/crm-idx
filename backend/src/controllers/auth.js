const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../services/email");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("📩 Register request received:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken: token,
    });

    await newUser.save();

    const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    await sendEmail(email, verifyUrl);

    res.status(201).json({ message: "Registration successful! Please check your email to verify." });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("🔍 Verifying token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
