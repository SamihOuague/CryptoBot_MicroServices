const { getAssets, sellOrder, buyOrder, borrow } = require("./api/binanceAPI");

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
            return res.status(200).send(order);
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
            return res.status(200).send(order);
        } catch(err) {
            return res.send({err});
        }
    },
    borrowAndSell: async (req, res) => {
        const { symbol, leverage } = req.body;
        let asset = await (await getAssets(symbol)).assets[0];
        let quote = toPrecision(asset.quoteAsset.free, 2);
        let convertedQuote = toPrecision((Number(leverage) * Number(quote)) / Number(asset.indexPrice));
        await borrow(toPrecision(convertedQuote), symbol, asset.baseAsset.asset);
        let t = await sellOrder(toPrecision(Number(convertedQuote)), symbol);
        return res.send(t);
    },
    borrowAndBuy: async (req, res) => {
        const { symbol, leverage } = req.body;
        let asset = await (await getAssets(symbol)).assets[0];
        let quote = toPrecision(asset.quoteAsset.free, 2);
        let convertedQuote = Number(quote) * (Number(leverage) - 1);
        await borrow(toPrecision(convertedQuote), symbol, asset.quoteAsset.asset);
        let t = await buyOrder(toPrecision(Number(convertedQuote) + Number(quote)), symbol);
        return res.send(t);
    },
    buyWithQt: async (req, res) => {
        const { symbol, qt } = req.body;
        let t = await buyOrder(toPrecision(qt), symbol);
        return res.send(t);
    },
    sellWithQt: async (req, res) => {
        const { symbol, qt } = req.body;
        let t = await sellOrder(toPrecision(qt), symbol);
        return res.send(t);
    }
}