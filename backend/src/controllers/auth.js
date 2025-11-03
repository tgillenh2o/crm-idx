const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/email");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verified?email=${encodeURIComponent(email)}`;
    await sendEmail(email, verifyUrl);

    return res.status(201).json({ message: "Registration successful! Check your email to verify." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed. Please try again." });
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

// Verify user email
exports.verify = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).send("Invalid verification link");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    user.verified = true;
    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/verified`);
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).send("Verification failed. Try again.");
  }
};
