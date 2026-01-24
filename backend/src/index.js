require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/leads");

connectDB();

const app = express();

/* ✅ CORS — SAFE + SIMPLE */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://crm-idx-frontend.onrender.com" // ✅ REAL frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use("/api/leads", leadRoutes);


/* ✅ REQUIRED for preflight */
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

/* ✅ sanity check */
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
