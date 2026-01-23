require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

connectDB();

const app = express();

// ✅ CORS MUST COME FIRST
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle preflight explicitly
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Optional sanity check
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
