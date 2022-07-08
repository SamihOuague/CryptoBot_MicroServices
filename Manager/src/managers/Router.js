const router = require("express").Router();
const { getAssets, sellPosition, repayPosition } = require("./Controller");

router.get("/get-assets", getAssets);
router.post("/sell-position", sellPosition);
router.post("/repay-position", repayPosition);

module.exports = router;