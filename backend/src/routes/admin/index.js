const { Router } = require("express");

const router = Router();

router.use(require("./content.admin.routes"));
router.use(require("./series.admin.routes"));
router.use(require("./user.admin.routes"));
router.use(require("./stats.admin.routes"));

module.exports = router;
