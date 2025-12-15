const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const ctrl = require("../controllers/leadController");

router.use(auth);

router.get("/", ctrl.getLeads);
router.get("/pond", ctrl.getPond);
router.put("/:id/pond", ctrl.moveToPond);

router.put("/:id/assign", role("teamAdmin"), ctrl.assignLead);
router.delete("/:id", role("teamAdmin"), ctrl.deleteLead);

module.exports = router;
