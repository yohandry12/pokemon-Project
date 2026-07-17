const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const contentController = require("../controllers/content.controller");

const router = Router();

router.get("/contents", auth, contentController.list);
// /new et /trending doivent rester déclarées avant /:id
router.get("/contents/new", contentController.listNew);
router.get("/contents/trending", contentController.listTrending);
router.get("/contents/:id", auth, contentController.getById);

module.exports = router;
