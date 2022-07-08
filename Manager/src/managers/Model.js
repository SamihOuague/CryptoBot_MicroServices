const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: false,
        default: null,
    },
    secretKey: {
        type: String,
        required: false,
        default: null
    }
}, {collection: "user"});

module.exports = mongoose.model("user", Schema);