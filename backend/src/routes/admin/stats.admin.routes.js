const { Router } = require("express");
const adminAuth = require("../../middlewares/adminAuth.middleware");
const adminStatsController = require("../../controllers/adminStats.controller");

const router = Router();

router.get("/admin/stats", adminAuth, adminStatsController.getStats);

module.exports = router;
