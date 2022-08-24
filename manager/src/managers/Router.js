const router = require("express").Router();
const { allPairs, addAsset, listAssets, updateAsset, deleteAsset, updateLog, getAsset } = require("./Controller");


router.get("/", listAssets);
router.get("/all-pairs", allPairs);
router.get("/asset/:symbol", getAsset)
router.post("/add-asset", addAsset);
router.put("/update-asset", updateAsset);
router.delete("/delete-asset", deleteAsset);
router.post("/update-log", updateLog);

module.exports = router;