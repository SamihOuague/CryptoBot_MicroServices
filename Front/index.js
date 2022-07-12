const express = require("express");
let app = express();

app.use(express.static("./build"));

app.listen(3000);