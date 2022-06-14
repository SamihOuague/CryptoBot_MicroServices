let express = require("express");
let users = require("./users/Router");
let app = express();

app.use(express.json());
app.use(users);

module.exports = app;