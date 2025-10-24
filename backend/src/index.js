require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Mongo connected"))
  .catch(err => console.error("❌ Mongo connection error:", err));

app.get("/", (req, res) => res.json({ ok: true, service: "crm-idx-backend" }));
app.use("/api/auth", authRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found", path: req.originalUrl }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
