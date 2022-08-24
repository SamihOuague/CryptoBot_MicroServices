const { getAssets, sellOrder, buyOrder } = require("./api/binanceAPI");
const mongoose = require("mongoose");
const ManagerModel = mongoose.model("manager", new mongoose.Schema({stoploss: String, takeprofit: String}, {collection: "managers"}));

function toPrecision(x, p=2) {
    let n = Number(x);
    let np = p;
    if (!n) return 0;
    n = String(x);
    n = n.split(".");
    if (Number(n[0]) == 0 && n[1]) {
        for (let i = 0; i < n[1].length; i++) {
            if (n[1][i] != "0") {
                np = i + p;
                break;
            }
        }
    }
    n[1] = n[1].substring(0, np);
    return n.join(".");
}

module.exports = {
    buyPosition: async (req, res) => {
        try {
            const { symbol } = req.body;
            let asset = await (await getAssets(symbol)).assets[0];
            let quote = toPrecision(asset.quoteAsset.free, 2);
            let order = await buyOrder(quote, symbol);
            let mng = await ManagerModel.findOne({symbol});
            return res.status(200).send({...order, stoploss: mng.stoploss, takeprofit: mng.takeprofit});
        } catch(err) {
            return res.send({err})
        }
    },
    sellPosition: async (req, res) => {
        try {
            const { symbol } = req.body;
            let asset = await (await getAssets(symbol)).assets[0];
            let base = toPrecision(asset.baseAsset.free, 2);
            let order = await sellOrder(base, symbol);
            let mng = await ManagerModel.findOne({symbol});
            return res.status(200).send({...order, stoploss: mng.stoploss, takeprofit: mng.takeprofit});
        } catch(err) {
            return res.send({err});
        }
    },
    createOco: async (req, res) => {
        let asset = await (await getAssets("BNBETH")).assets[0];
        let base = toPrecision(asset.baseAsset.free, 2);
        let takeProfit = Number(asset.indexPrice) + (Number(asset.indexPrice) * 0.005);
        let stopLoss = Number(asset.indexPrice) - (Number(asset.indexPrice) * 0.01);
        let oco = await ocoOrder(base, toPrecision(takeProfit, 4), toPrecision(stopLoss, 4) ,"BNBETH");
        return res.send(oco);
    }
}