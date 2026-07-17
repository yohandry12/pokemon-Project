const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const recommendationController = require("../controllers/recommendation.controller");

const router = Router();

router.get("/recommendations/:userId", auth, recommendationController.list);

module.exports = router;
