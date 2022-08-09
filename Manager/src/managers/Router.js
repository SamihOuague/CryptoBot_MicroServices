const router = require("express").Router();
const { sellPosition, 
        repayPosition, 
        getSymbol,
        symbolSwitch,
        botConnect,
        buyPosition,
        closePosition,
} = require("./Controller");

router.get("/:symbol", getSymbol);
router.post("/sell-position", sellPosition);
router.post("/repay-position", repayPosition);
router.post("/switch/:symbol", symbolSwitch);
router.post("/bot-connect", botConnect);
router.post("/buy-position", buyPosition);
router.post("/close-position", closePosition);

module.exports = router;