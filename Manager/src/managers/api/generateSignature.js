const crypto = require("crypto");

module.exports = (request) => {
    return crypto.createHmac("sha256", process.env.SECRETKEY).update(request).digest("hex");
};