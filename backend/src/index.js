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

app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Mongo connected"))
  .catch(err => { console.error("❌ Mongo error:", err); process.exit(1); });

// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "crm-idx-backend", time: new Date() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ error: "Route not found", path: req.originalUrl }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
