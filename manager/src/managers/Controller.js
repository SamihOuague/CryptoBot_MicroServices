const { getAllPairs, getAssets } = require("./api/binanceAPI");
const Model = require("./Model");

module.exports = {
    allPairs: async (req, res) => {
        const pairs = await (await getAllPairs());
        return res.send(pairs);
    },
    listAssets: async (req, res) => {
        return res.send(await Model.find());
    }, 
    getAsset: async (req, res) => {
        try {
            if (req.params.symbol) return res.send(await getAssets(req.params.symbol));
            return res.send({"msg": "Bad request."});
        } catch(err) {
            return res.send({err});
        }
    },
    addAsset: async (req, res) => {
        try {
            const { symbol } = req.body;
            if (symbol) {
                let model = new Model(req.body);
                return res.send(await model.save());
            }
            return res.send({"msg": "Invalid symbol"});
        } catch(err) {
            return res.send({err});
        }
    },
    updateAsset: async (req, res) => {
        try {
            const { symbol, stoploss, takeprofit } = req.body;
            if (symbol && Number(stoploss) > 0.002 && Number(takeprofit) > 0.002)
                return res.send(await Model.findOneAndUpdate({symbol}, {stoploss, takeprofit}));
            return res.status(400).send({"msg": "Bad request"});
        } catch(err) {
            return res.send({err});
        }
    },
    deleteAsset: async (req, res) => {
        try {
            const { symbol } = req.body;
            let d = await Model.findOneAndDelete({symbol});
            if (d) return res.send(d);
            return res.status(400).send({"msg": "Bad request"});
        } catch(err) {
            return res.send({err});
        }
    },
    updateLog: async (req, res) => {
        const { log, symbol } = req.body;
        let logs = (await Model.findOne({symbol}));
        if (logs && log) {
            logs = logs.logs;
            logs.push(log);
            return res.send(await Model.findOneAndUpdate({symbol}, {logs}));
        }
        return res.status(400).send({"msg": "Bad request"});
    }
}