const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const favoriteController = require("../controllers/favorite.controller");

const router = Router();

router.get("/favorites", auth, favoriteController.list);
router.post("/favorites/add", auth, favoriteController.add);
router.delete("/favorites/remove/:contentId", auth, favoriteController.remove);

module.exports = router;
