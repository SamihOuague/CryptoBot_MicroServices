const router = require("express").Router();
const { register, login, genSign, updateAPIKey } = require("./Controller");


router.post("/login", login);
router.post("/register", register);
router.get("/get-keys", genSign);
router.post("/update-api", updateAPIKey);

module.exports = router;