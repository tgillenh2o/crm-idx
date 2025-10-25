exports.register = async (req, res) => {
  try {
    console.log("📩 Register request received:", req.body);

    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    console.log("✅ User created:", user.email);
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("🔥 Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
