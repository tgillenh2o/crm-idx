const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/leads"); // ✅ Add this line

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes); // ✅ Add this line

// Test route (optional)
app.get("/", (req, res) => res.send("✅ CRM IDX backend is running"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
