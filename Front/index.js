const express = require("express");
let app = express();
let path = require("path");

app.use(express.static("./build"));

app.get("*", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "Front/build", "index.html"))
});

app.listen(3000);