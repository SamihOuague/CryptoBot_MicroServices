const router = require("express").Router();
const { buyPosition, 
        sellPosition,
        createOco,
        allAssets,
} = require("./Controller");

router.post("/buy-position", buyPosition);
router.post("/sell-position", sellPosition);
router.post("/create-oco", createOco);
router.get("/all-assets", allAssets);

module.exports = router;