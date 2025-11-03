// backend/src/index.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// -----------------------------
// ENVIRONMENT CHECK
// -----------------------------
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI not set in environment variables");
  process.exit(1);
}

if (!process.env.FRONTEND_URL) {
  console.error("Error: FRONTEND_URL not set in environment variables");
  process.exit(1);
}

// -----------------------------
// MONGODB CONNECTION
// -----------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

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
  console.log(`Server running on port ${PORT}`);
});
