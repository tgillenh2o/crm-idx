const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // should populate req.user
const {
  createLead,
  getLeads,
  getLeadPond,
  updateLead,
  assignLead
} = require("../controllers/leads");

// All routes require authentication
router.post("/", authMiddleware(), createLead);
router.get("/", authMiddleware(), getLeads);
router.get("/pond", authMiddleware(["teamAdmin", "teamMember"]), getLeadPond);
router.put("/:id", authMiddleware(), updateLead);
router.put("/:id/assign", authMiddleware(["teamAdmin"]), assignLead);

module.exports = router;
