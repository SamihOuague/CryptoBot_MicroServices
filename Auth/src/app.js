let express = require("express");
let users = require("./users/Router");
let app = express();
let cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(users);

module.exports = app;