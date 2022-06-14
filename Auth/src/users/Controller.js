const Model = require("./Model");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRETKEY;

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) return res.sendStatus(400);
        let user = await Model.findOne({username});
        if (user && user.comparePwd(password)) {
            let token = jwt.sign({u: user.username, uid: user._id}, secret);
            return res.send({token}); 
        } else return res.sendStatus(400);
    },
    register: async (req, res) => {
        let model = new Model(req.body);
        try {
            let user = await model.save();
            let token = jwt.sign({u: user.username, uid: user._id}, secret);
            return res.status(201).send({token});
        } catch (err) {
            return res.status(400).send(err);
        }
    },
    ping: async (req, res) => {
        return res.send({});
    }
}