const router = require("express").Router();
const { getAssets, 
        sellPosition, 
        repayPosition, 
        getSymbol,
        symbolSwitch
} = require("./Controller");

router.get("/get-assets", getAssets);
router.get("/:symbol", getSymbol);
router.post("/sell-position", sellPosition);
router.post("/repay-position", repayPosition);
router.post("/switch/:symbol", symbolSwitch);

module.exports = router;