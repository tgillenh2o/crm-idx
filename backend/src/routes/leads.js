const router = require("express").Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { getMyLeads, getLeadPond, createLead, moveToPond } = require("../controllers/leads");

router.get("/", verifyToken, getMyLeads);
router.get("/pond", verifyToken, getLeadPond);
router.post("/", verifyToken, createLead);
router.patch("/pond/:id", verifyToken, moveToPond);

module.exports = router;
