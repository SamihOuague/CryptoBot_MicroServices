const router = require("express").Router();
const { buyPosition, 
        sellPosition,
        borrowAndSell,
        buyWithQt,
        sellWithQt,
} = require("./Controller");

router.post("/buy-position", buyPosition);
router.post("/sell-position", sellPosition);
router.post("/borrow-n-sell", borrowAndSell);
router.post("/buy-n-repay", buyWithQt);
router.post("/sell-n-repay", sellWithQt);

module.exports = router;