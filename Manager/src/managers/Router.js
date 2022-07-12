const router = require("express").Router();
const { getAssets, 
        sellPosition, 
        repayPosition, 
        getSymbol,
        symbolSwitch,
        botConnect
} = require("./Controller");

router.get("/get-assets", getAssets);
router.get("/:symbol", getSymbol);
router.post("/sell-position", sellPosition);
router.post("/repay-position", repayPosition);
router.post("/switch/:symbol", symbolSwitch);
router.post("/bot-connect", botConnect);

module.exports = router;