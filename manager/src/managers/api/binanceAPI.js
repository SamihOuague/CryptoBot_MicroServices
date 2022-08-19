const fetch = require("node-fetch");
const crypto = require("crypto");
const mongoose = require("mongoose");
//const UserModel = mongoose.model("user", new mongoose.Schema({apiKey: String, secretKey: String}, {collection: "users"}));
const APIKEY = "M5v1CQxRoQzVA6ECsWROVpFWH33rEtRwzXMj2rKoxSMOROz8xp4vNsTPFXC5eYNY"
const SECRETKEY = "ONdF4QjnMJbndB71ffExBSJEfmpfX0gKf29CEiOxrXjaFarnQLsBHHUaB6epWq9m"
module.exports = {
    borrow: async (amount, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/loan";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&asset=BNB&amount=" + String(amount) + "&symbol=" + symbol;
        //let user = await UserModel.findOne({username: "admin"});
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": APIKEY
            }
        })).json();
        return response;
    },
    buyOrder: async (qt, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=BUY&type=MARKET&symbol=" + symbol;
        //let user = await UserModel.findOne({username: "admin"});
        sign = sign + "&quoteOrderQty=" + qt;
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": APIKEY
            }
        })).json();
        return response;
    },
    sellOrder: async (qt, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=SELL&type=MARKET&symbol=" + symbol;
        //let user = await UserModel.findOne({username: "admin"});
        sign = sign + "&quantity=" + qt;
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": APIKEY
            }
        })).json();
        return response;
    },
    ocoOrder: async (qt, price, stopPrice, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order/oco";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=SELL&stopPrice="+ stopPrice +"&stopLimitPrice=" + stopPrice + "&symbol=" + symbol;
        //let user = await UserModel.findOne({username: "admin"});
        sign = sign + "&quantity=" + qt + "&price=" + price +"&stopLimitTimeInForce=GTC";
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": APIKEY
            }
        })).json();
        return response;
    },
    getAssets: async (symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/isolated/account";
        let sign = "timestamp=" + String(Date.now()) + "&symbols=" + symbol;
        //let user = await UserModel.findOne({username: "admin"});
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": APIKEY
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
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature="+hashSign;
        return await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": APIKEY,
            }
        })).json();
    },
    maxBorrowable: async (asset, symbol) => {
        let url = "https://api.binance.com/sapi/v1/margin/maxBorrowable";
        let sign = "timestamp=" + String(Date.now()) + "&asset=" + asset + "&isolatedSymbol=" + symbol;
        let hashSign = crypto.createHmac("sha256", SECRETKEY).update(sign).digest("hex");
        url = url + "?" + sign + "&signature=" + hashSign;
        return await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": APIKEY
            }
        })).json();
    }
}