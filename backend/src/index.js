// backend/src/index.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// -----------------------------
// MIDDLEWARE
// -----------------------------

// Enable CORS for your frontend domain
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://crm-idx-frontend.onrender.com",
    credentials: true,
  })
);

// Parse incoming JSON requests
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
