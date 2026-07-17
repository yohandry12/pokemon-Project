const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const subscriptionController = require("../controllers/subscription.controller");

const router = Router();

router.post("/subscribe", auth, subscriptionController.subscribe);
router.get("/active", auth, subscriptionController.getActive);
router.post("/cancel", auth, subscriptionController.cancel);
router.get("/plans", subscriptionController.listPlans);
router.get("/subscriptions", auth, subscriptionController.listUserSubscriptions);

module.exports = router;
