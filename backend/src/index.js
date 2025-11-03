// backend/src/index.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://crm-idx-frontend.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

// -----------------------------
// CONNECT TO MONGODB
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -----------------------------
// ROUTES
// -----------------------------
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
