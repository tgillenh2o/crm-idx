const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on", PORT));
