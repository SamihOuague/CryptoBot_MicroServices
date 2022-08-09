const { assets, order, borrow, ticker } = require("./api/binanceAPI");
const Model = require("./Model");
const jwt = require("jsonwebtoken");

function toPrecision(x, p=3) {
    let n = Number(x);
    if (!n) return 0;
    n = String(x);
    n = n.split(".");
    if (n[1])
        n[1] = n[1].substring(0, p);
    return n.join(".");
}

module.exports = {
    buyPosition: async (req, res) => {
        try {
            let symbol = await Model.findOne({symbol: "BNBUSDT"});
            if (!symbol.actived)
                return res.status(400).send({disabled: true});
            let asset = (await assets("BNBUSDT")).assets[0];
            let free = toPrecision(asset.quoteAsset.free);
            if (!symbol.logs.length) {
                symbol.logs.push(Date.now() + " " + asset.quoteAsset.free);
                (await symbol.save());
            }
            let o = await order("BUY", free, "BNBUSDT");
            return res.status(200).send(o);
        } catch(err) {
            return res.status(400).send({err});
        }
    },
    closePosition: async (req, res) => {
        try {
            let asset = (await assets("BNBUSDT")).assets[0]; 
            let free = toPrecision(asset.quoteAsset.free);
            let symbol = await Model.findOne({symbol: "BNBUSDT"});
            let o = await order("BUY", free, "BNBUSDT");
            symbol.logs.push(Date.now() + " " + asset.quoteAsset.free);
            (await symbol.save());
            return res.status(200).send(o);
        } catch(err) {
            return res.status(400).send({err});
        }
    },
    sellPosition: async (req, res) => {
        try {
            let symbol = await Model.findOne({symbol: "BNBUSDT"});
            if (!symbol.actived)
                return res.status(400).send({disabled: true});
            let asset = (await assets("BNBUSDT")).assets[0];
            let price = Number((await ticker("BNBUSDT")).price);    
            let free = Number(toPrecision(asset.quoteAsset.free));
            let b = toPrecision(free / price);
            await borrow(b, "BNBUSDT");
            asset = (await assets("BNBUSDT")).assets[0];
            free = toPrecision(asset.baseAsset.free);
            
            o = await order("SELL", free, "BNBUSDT");
            return res.status(200).send(o);
        } catch(err) {
            return res.status(400).send({err});
        }
    },
    repayPosition: async (req, res) => {
        try {
            let asset = (await assets("BNBUSDT")).assets[0];
            let price = Number((await ticker("BNBUSDT")).price);
            let borrowed = Number(asset.baseAsset.borrowed);
            let symbol = await Model.findOne({symbol: "BNBUSDT"});
            let o;
            borrowed = toPrecision(borrowed*price);
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
            let asset = await assets(req.params.symbol.toUpperCase());
            return res.status(200).send({symbol, asset});
        } catch(err) {
            return res.status(400).send({err});
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
            return res.status(400).send({err});
        }
    },
    botConnect: async (req, res) => {
        try {
            if (req.body.pwd != process.env.BOTPWD) return res.status(400).send({msg: "Unauthorized"});
            let token = jwt.sign({name: "zbiboubot"}, process.env.SECRETJWT);
            return res.status(200).send({token});
        } catch(err) {
            return res.status(400).send({msg: "Unauthorized"});
        }
    }
}