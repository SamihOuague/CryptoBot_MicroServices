const app = require("./src/app");
require("./src/db/mongoose");

app.listen(process.env.PORT);