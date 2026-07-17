const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

const router = Router();

// Auth requise : évite que le proxy IA soit utilisable anonymement
router.post("/chat", auth, chatController.completion);

module.exports = router;
