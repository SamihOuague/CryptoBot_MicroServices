const express = require("express");
const cors = require("cors");
const app = express();
const managers = require("./managers/Router");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    try {
        if (req.body.pwd) return next();
        if (!req.headers.authorization) return res.status(400).send({msg: "Unauthorized"});
        let token = req.headers.authorization.split(" ")[1];
        if (!jwt.verify(token, process.env.SECRETJWT)) return res.status(400).send({msg: "Unauthorized"});
        return next();
    } catch(err) {
        return res.status(400).send({msg: "Unauthorized", err});
    }
});
app.use(managers);

module.exports = app;