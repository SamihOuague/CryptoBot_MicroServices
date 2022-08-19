const fetch = require("node-fetch");
const crypto = require("crypto");

module.exports = async (secretKey, apiKey) => {
    let url = "https://api.binance.com/sapi/v1/margin/isolated/account";
    let sign = "timestamp=" + String(Date.now()) + "&symbols=BNBUSDT";
    let hashSign = crypto.createHmac("sha256", secretKey).update(sign).digest("hex");;
    url = url + "?" + sign + "&signature="+hashSign;
    let response = await (await fetch(url, {
        method: "GET",
        headers: {
            "X-MBX-APIKEY": apiKey
        }
    })).json();
    return response;
}