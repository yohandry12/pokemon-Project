const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const seriesController = require("../controllers/series.controller");

const router = Router();

router.get("/series", auth, seriesController.list);
// /new et /trending doivent rester déclarées avant /:id
router.get("/series/new", seriesController.listNew);
router.get("/series/trending", seriesController.listTrending);
router.get("/series/:id", auth, seriesController.getById);
router.post("/series", auth, seriesController.create);

module.exports = router;
