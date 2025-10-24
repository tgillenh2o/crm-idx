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

// ✅ Proper CORS configuration
app.use(
  cors({
    origin: [
      "https://crm-idx-frontend.onrender.com", // frontend Render app
      "http://localhost:5173" // local dev
    ],
    credentials: true,
  })
);

// ✅ JSON body parsing
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  });

// ✅ Health check (should respond at your backend root)
app.get("/", (req, res) => {
  res.json({ ok: true, service: "crm-idx-backend", time: new Date() });
});

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);

// ✅ 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
