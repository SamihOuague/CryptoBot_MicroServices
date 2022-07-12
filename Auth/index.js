let app = require("./src/app");
let Model = require("./src/users/Model");
require("./src/db/mongoose");

(async () => {
    await Model.deleteMany({});
    let user = new Model({
        username: process.env.USERNAME,
        password: process.env.PWD,
        apiKey: "",
        secretKey: ""
    });
    await user.save();
})();

app.listen(process.env.PORT);