const express = require("express");
const cors = require("cors");
const app = express();
const managers = require("./orders/Router");

app.use(cors());
app.use(express.json());

app.use(managers);

module.exports = app;