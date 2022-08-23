const fetch = require("node-fetch");
const crypto = require("crypto");
const mongoose = require("mongoose");
const UserModel = mongoose.model("user", new mongoose.Schema({apiKey: String, secretKey: String}, {collection: "users"}));

module.exports = {
    borrow: async (amount, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/loan";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&asset=BNB&amount=" + String(amount) + "&symbol=" + symbol;
        let user = await UserModel.findOne({username: "admin"});
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": user.apiKey
            }
        })).json();
        return response;
    },
    buyOrder: async (qt, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=BUY&type=MARKET&symbol=" + symbol;
        let user = await UserModel.findOne({username: "admin"});
        sign = sign + "&quoteOrderQty=" + qt;
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": user.apiKey
            }
        })).json();
        return response;
    },
    sellOrder: async (qt, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=SELL&type=MARKET&symbol=" + symbol;
        let user = await UserModel.findOne({username: "admin"});
        sign = sign + "&quantity=" + qt;
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": user.apiKey
            }
        })).json();
        return response;
    },
    ocoOrder: async (qt, price, stopPrice, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order/oco";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=SELL&stopPrice="+ stopPrice +"&stopLimitPrice=" + stopPrice + "&symbol=" + symbol;
        let user = await UserModel.findOne({username: "admin"});
        sign = sign + "&quantity=" + qt + "&price=" + price +"&stopLimitTimeInForce=GTC";
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": user.apiKey
            }
        })).json();
        return response;
    },
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
    maxBorrowable: async (asset, symbol) => {
        let url = "https://api.binance.com/sapi/v1/margin/maxBorrowable";
        let sign = "timestamp=" + String(Date.now()) + "&asset=" + asset + "&isolatedSymbol=" + symbol;
        let hashSign = crypto.createHmac("sha256", user.secretKey).update(sign).digest("hex");
        url = url + "?" + sign + "&signature=" + hashSign;
        return await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": user.apiKey
            }
        })).json();
    }
}