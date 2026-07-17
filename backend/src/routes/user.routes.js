const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const router = Router();

// Chemin historique sans préfixe /api (le frontend appelle PUT /profile)
router.put("/profile", auth, userController.updateProfile);

module.exports = router;
