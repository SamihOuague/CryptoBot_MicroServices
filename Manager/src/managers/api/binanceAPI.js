const genSign = require("./generateSignature");
const fetch = require("node-fetch");

module.exports = {
    borrow: async (amount, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/loan";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&asset=BNB&amount=" + String(amount) + "&symbol=" + symbol;
        let hashSign = genSign(sign);
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": process.env.APIKEY
            }
        })).json();
        return response;
    },
    order: async (side, qt, symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/order";
        let sign = "timestamp=" + String(Date.now()) + "&isIsolated=TRUE&side=" + side + "&type=MARKET&symbol=" + symbol;
        if (side == "SELL")
            sign = sign + "&quantity=" + qt;
        else
            sign = sign + "&quoteOrderQty=" + qt + "&sideEffectType=AUTO_REPAY";
        let hashSign = genSign(sign);
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": process.env.APIKEY
            }
        })).json();
        return response;
    },
    assets: async (symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/sapi/v1/margin/isolated/account";
        let sign = "timestamp=" + String(Date.now()) + "&symbols=" + symbol;
        let hashSign = genSign(sign);
        url = url + "?" + sign + "&signature="+hashSign;
        let response = await (await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": process.env.APIKEY
            }
        })).json();
        return response;
    },
    ticker: async (symbol = "BNBUSDT") => {
        let url = "https://api.binance.com/api/v3/ticker/price?symbol="+symbol;
        return await (await fetch(url)).json();
    }
}