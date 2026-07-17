const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const historyController = require("../controllers/history.controller");

const router = Router();

router.post("/history", auth, historyController.save);
router.get("/history", auth, historyController.list);

module.exports = router;
