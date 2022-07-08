const Model = require("./Model");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRETKEY;

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) return res.sendStatus(400);
        try {
            let user = await Model.findOne({username});
            if (user && user.comparePwd(password)) {
                let token = jwt.sign({u: user.username, uid: user._id}, secret);
                return res.send({token}); 
            } else return res.sendStatus(400);
        } catch(err) {
            return res.status(400).send({err});
        }
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
    genSign: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let uid = jwt.verify(token, process.env.SECRETKEY).uid;
            let user = await Model.findOne({_id: uid});
            const { apiKey, secretKey } = user;
            if (apiKey && secretKey)
                return res.status(200).send({apiKey, secretKey});
            else
                return res.status(400).send({msg: "API Key not set"});
        } catch(err) {
            return res.status(400).send(err);
        }
    },
    updateAPIKey: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let uid = jwt.verify(token, process.env.SECRETKEY).uid;
            let user = await Model.findOne({_id: uid});
            if (req.body.apiKey && req.body.secretKey) {
                user.apiKey = req.body.apiKey;
                user.secretKey = req.body.apiKey;
                let u = await user.save();
                return res.status(200).send(u);
            } else {
                return res.sendStatus(400);
            }
        } catch(err) {
            return res.status(400).send(err);
        }
    }
}