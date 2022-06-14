const router = require("express").Router();
const { register, login, ping } = require("./Controller");


router.post("/login", login);
router.post("/register", register);
router.get("/ping", ping);

module.exports = router;