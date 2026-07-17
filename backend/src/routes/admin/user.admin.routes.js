const { Router } = require("express");
const auth = require("../../middlewares/auth.middleware");
const adminUserController = require("../../controllers/adminUser.controller");

const router = Router();

// NOTE: protégées par auth simple comme dans l'ancien code (UserAdmin.js
// utilisait le middleware user, pas admin). À durcir avec un vrai contrôle
// de rôle admin.
router.get("/admin/users", auth, adminUserController.list);
router.patch("/admin/users/:userId/activate", auth, adminUserController.setActive);
router.delete("/admin/users/:userId", auth, adminUserController.remove);

module.exports = router;
