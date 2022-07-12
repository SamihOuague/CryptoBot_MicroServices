const app = require("./src/app");
const { assets } = require("./src/managers/api/binanceAPI");
require("./src/db/mongoose");
const Model = require("./src/managers/Model");
(async () => {
        await Model.deleteMany({});
        let pair = new Model({
            symbol: "BNBUSDT",
            actived: false,
            logs: []
        });
        await pair.save();
    }
)()

app.listen(process.env.PORT);