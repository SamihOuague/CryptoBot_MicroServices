const router = require("express").Router();
const { buyPosition, 
        sellPosition,
        createOco,
} = require("./Controller");

router.post("/buy-position", buyPosition);
router.post("/sell-position", sellPosition);
router.post("/create-oco", createOco);

module.exports = router;