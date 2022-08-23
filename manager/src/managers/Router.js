const router = require("express").Router();
const { allPairs, addAsset, listAssets, updateAsset, deleteAsset, updateLog } = require("./Controller");


router.get("/", listAssets);
router.get("/all-pairs", allPairs);
router.post("/add-asset", addAsset);
router.put("/update-asset", updateAsset);
router.delete("/delete-asset", deleteAsset);
router.post("/update-log", updateLog);

module.exports = router;