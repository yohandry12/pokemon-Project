const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const contactController = require("../controllers/contact.controller");

const router = Router();

router.post("/contact", auth, contactController.create);
router.get("/contact", contactController.list);
router.post("/contact/:id/reply", contactController.reply);

module.exports = router;
