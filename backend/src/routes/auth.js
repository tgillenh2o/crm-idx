const nodemailer = require("nodemailer");

// Configure transporter (example using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your email
    pass: process.env.EMAIL_PASS        // your email password or app password
  }
});

// === REGISTER ===
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || "supersecretkey", { expiresIn: "7d" });

    // Send confirmation email
    await transporter.sendMail({
      from: `"CRM IDX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to CRM IDX!",
      html: `<p>Hi ${name},</p><p>Thanks for registering. Your account is ready to use!</p>`
    });

    res.json({
      message: "User registered successfully, confirmation email sent",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});
