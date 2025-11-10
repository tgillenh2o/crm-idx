// src/routes/invites.js
const express = require("express");
const router = express.Router();
const { createInvite, acceptInvite } = require("../controllers/invites");
const { authMiddleware } = require("../middleware/auth");

// Only admins can create invites
router.post("/", authMiddleware(["teamAdmin"]), createInvite);

// Endpoint for user to accept invite
router.get("/accept/:token", acceptInvite);

module.exports = router;
