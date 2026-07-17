const { Router } = require("express");

const router = Router();

// Routes client
router.use(require("./auth.routes"));
router.use(require("./content.routes"));
router.use(require("./series.routes"));
router.use(require("./favorite.routes"));
router.use(require("./history.routes"));
router.use(require("./rating.routes"));
router.use(require("./recommendation.routes"));
router.use(require("./subscription.routes"));
router.use(require("./payment.routes"));
router.use(require("./contact.routes"));
router.use(require("./chat.routes"));

// Routes admin
router.use(require("./admin"));

module.exports = router;
