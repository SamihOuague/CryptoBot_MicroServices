const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

Schema.pre("save", function(next) {
    try {
        let hash = bcrypt.hashSync(this.password, 12);
        if (hash) this.set("password", hash);
    } catch(err) {
        console.log(err);
    }
    next();
});

Schema.methods.comparePwd = function(plainPwd) {
    return bcrypt.compareSync(plainPwd, this.password);
}

module.exports = mongoose.model("user", Schema);