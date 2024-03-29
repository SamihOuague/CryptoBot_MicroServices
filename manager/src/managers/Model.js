const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    stoploss: {
        type: String,
        default: "0.01",
    },
    takeprofit: {
        type: String,
        default: "0.01",
    },
    logs: [String],
});

module.exports = mongoose.model("manager", Schema);