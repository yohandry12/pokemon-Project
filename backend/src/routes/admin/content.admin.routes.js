const { Router } = require("express");
const adminAuth = require("../../middlewares/adminAuth.middleware");
const contentController = require("../../controllers/content.controller");

const router = Router();

// Chemin historique (le frontend appelle POST /api/create/film)
router.post("/create/film", adminAuth, contentController.create);
router.put("/contents/:contentId", adminAuth, contentController.update);

module.exports = router;
