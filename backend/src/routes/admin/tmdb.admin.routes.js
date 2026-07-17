const { Router } = require("express");
const adminAuth = require("../../middlewares/adminAuth.middleware");
const tmdbController = require("../../controllers/tmdb.controller");

const router = Router();

router.get("/admin/tmdb/search", adminAuth, tmdbController.search);
router.get("/admin/tmdb/:type/:id", adminAuth, tmdbController.details);

module.exports = router;
