const fetch = require("node-fetch");
const crypto = require("crypto");
const mongoose = require("mongoose");
const UserModel = mongoose.model("user", new mongoose.Schema({apiKey: String, secretKey: String}, {collection: "users"}));

module.exports = {
    getAssets: async (symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/isolated/account";
        let sign = "timestamp=" + String(Date.now()) + "&symbols=" + symbol;
        let user = await UserModel.findOne({username: "admin"});
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": user.apiKey
            }
        })).json();
        return response;
    },
    ticker: async (symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/api/v3/ticker/price?symbol="+symbol;
        return await (await fetch(url)).json();
    },
    getAllPairs: async () => {
        let url = "https://api.binance.com/sapi/v1/margin/allPairs";
        let sign = "timestamp=" + String(Date.now());
        let user = await UserModel.findOne({username: "admin"});
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        return await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": user.apiKey,
            }
        })).json();
    },
}