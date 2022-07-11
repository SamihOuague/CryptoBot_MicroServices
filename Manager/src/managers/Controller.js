const { assets, order, borrow, ticker } = require("./api/binanceAPI");
const Model = require("./Model");

module.exports = {
    getAssets: async (req, res) => {
        try {
            let response = await assets("BNBUSDT");
            return res.status(200).send(response.assets[0]);
        } catch(err) {
            return res.sendStatus(400);
        }
    },
    sellPosition: async (req, res) => {
        try {
            let symbol = await Model.findOne({symbol: "BNBUSDT"});
            if (!symbol.actived)
                return res.status(400).send({disabled: true});
            let asset = (await assets("BNBUSDT")).assets[0];
            let price = Number((await ticker("BNBUSDT")).price);    
            let free = Number(asset.quoteAsset.free * 3);
            let b = String(free / price);
            let o;
            let f;
            b = b.split(".");
            b[1] = b[1].substring(0, 2);
            b = b.join(".");
            await borrow(b, "BNBUSDT");
            asset = (await assets("BNBUSDT")).assets[0];
            f = asset.baseAsset.free.split(".");
            f[1] = f[1].substring(0, 2);
            f = f.join(".");
            o = await order("SELL", f, "BNBUSDT");
            return res.status(200).send({});
        } catch(err) {
            return res.sendStatus(400);
        }
    },
    repayPosition: async (req, res) => {
        try {
            let asset = (await assets("BNBUSDT")).assets[0];
            let price = Number((await ticker("BNBUSDT")).price);
            let borrowed = Number(asset.baseAsset.borrowed);
            let symbol = await Model.findOne({symbol: "BNBUSDT"});
            let o;
            borrowed = String(borrowed*price).split(".");
            borrowed[1] = borrowed[1].substring(0, 2);
            borrowed = borrowed.join(".");
            o = await order("BUY", borrowed, "BNBUSDT");
            asset = (await assets("BNBUSDT")).assets[0];
            symbol.logs.push(Date.now() + " " + asset.quoteAsset.free);
            (await symbol.save());
            return res.status(200).send(o);
        } catch(err) {
            return res.status(400).send({err});
        }
    },
    getSymbol: async (req, res) => {
        try {
            if (!req.params.symbol) return res.sendStatus(400);
            let symbol = await Model.findOne({symbol: req.params.symbol.toUpperCase()});
            if (!symbol) return res.sendStatus(400);
            return res.status(200).send(symbol);
        } catch(err) {
            return res.sendStatus(400);
        }
    },
    symbolSwitch: async (req, res) => {
        try {
            if (!req.params.symbol) return res.sendStatus(400);
            let symbol = await Model.findOne({symbol: req.params.symbol.toUpperCase()});
            if (!symbol) return res.sendStatus(400);
            symbol.actived = !symbol.actived;
            let s = await symbol.save();
            return res.status(200).send(s);
        } catch(err) {
            return res.sendStatus(400);
        }
    }
}