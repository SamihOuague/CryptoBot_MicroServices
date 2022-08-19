const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    actived: {
        type: Boolean,
        defaultValue: true
    },
    logs: [String]
});

module.exports = mongoose.model("manager", Schema);