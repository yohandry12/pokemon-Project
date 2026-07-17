const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

const router = Router();

router.post("/pay", auth, paymentController.pay);
router.get("/payments", auth, paymentController.list);

module.exports = router;
