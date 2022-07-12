const router = require("express").Router();
const { register, login, updateAPIKey, ping } = require("./Controller");


router.post("/login", login);
router.post("/update-api", updateAPIKey);
router.post("/ping", ping);

module.exports = router;