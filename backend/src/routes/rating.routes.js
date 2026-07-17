const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const ratingController = require("../controllers/rating.controller");

const router = Router();

router.get("/ratings/:contentId", ratingController.list);
router.post("/ratings/:contentId", auth, ratingController.upsert);
router.delete("/ratings/:contentId", auth, ratingController.remove);

module.exports = router;
