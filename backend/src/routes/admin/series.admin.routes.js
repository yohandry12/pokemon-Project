const { Router } = require("express");
const adminAuth = require("../../middlewares/adminAuth.middleware");
const seriesController = require("../../controllers/series.controller");

const router = Router();

router.put("/series/:seriesId", adminAuth, seriesController.update);

module.exports = router;
