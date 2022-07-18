const router = require("express").Router();
const { register, login, updateAPIKey, ping, updateLogs } = require("./Controller");


router.post("/login", login);
router.post("/update-api", updateAPIKey);
router.post("/update-user", updateLogs);
router.post("/ping", ping);

module.exports = router;