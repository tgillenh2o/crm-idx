require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/leads");

connectDB();

const app = express();

/* ================== MIDDLEWARE ================== */

// ✅ Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173",                  // local dev frontend
    "https://crm-idx-frontend.onrender.com"   // deployed frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); // preflight for all routes

// ✅ Parse JSON and URL-encoded bodies BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== ROUTES ================== */

// Leads
app.use("/api/leads", leadRoutes);

// Auth
app.use("/api/auth", authRoutes);

// Sanity check
app.get("/", (req, res) => {
  res.send("API is running");
});

/* ================== START SERVER ================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
