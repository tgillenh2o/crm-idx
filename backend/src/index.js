require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/teams");
const inviteRoutes = require("./routes/invites");
const propertyRoutes = require("./routes/properties");
const leadRoutes = require("./routes/leads");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Mongo connected"))
  .catch(err => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);

// CORS configuration (move outside of app.use(cors()) if needed)
app.use(cors({
  origin: ["https://crm-idx-frontend.onrender.com"],
  credentials: true
}));

// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "crm-idx-backend" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));