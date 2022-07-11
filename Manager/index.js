const app = require("./src/app");
const { assets } = require("./src/managers/api/binanceAPI");
require("./src/db/mongoose");
const Model = require("./src/managers/Model");
(async () => {
        await Model.deleteMany({});
        let a = await assets();
        let pair = new Model({
            symbol: "BNBUSDT",
            actived: false,
            logs: [
                (Date.now() + " " + a.assets[0].quoteAsset.free),
            ]
        });
        await pair.save();
    }
)()

app.listen(process.env.PORT);