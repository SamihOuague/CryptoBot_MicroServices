const Model = require("./Model");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRETKEY;
const fetchAssets = require("./api/fetch-assets");

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) return res.sendStatus(400);
        try {
            if (username == process.env.USERNAME && password == process.env.FIRSTPWD) {
                let u = await Model.find({});
                if (u.length == 0) {
                    u = new Model({
                        username,
                        password,
                        apiKey: "",
                        secretKey: ""
                    });
                    await u.save();
                }
            }
            let user = await Model.findOne({username});
            if (user && user.comparePwd(password)) {
                let token = jwt.sign({u: user.username, uid: user._id}, secret);
                return res.status(200).send({token}); 
            } else return res.sendStatus(400);
        } catch(err) {
            return res.status(400).send({err});
        }
    },
    updateAPIKey: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let uid = jwt.verify(token, process.env.SECRETKEY).uid;
            let asset = await fetchAssets(req.body.secretKey, req.body.apiKey);
            if (!asset.assets) return res.sendStatus(400);
            let user = await Model.findOneAndUpdate({_id: uid}, {apiKey: req.body.apiKey, secretKey: req.body.secretKey});
            return res.status(200).send(user);
        } catch(err) {
            return res.status(400).send(err);
        }
    },
    updateLogs: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let uid = jwt.verify(token, process.env.SECRETKEY).uid;
            let user = await Model.findOne({_id: uid});
            if (user.comparePwd(req.body.password)) {
                user.username = req.body.username;
                user.password = req.body.newPassword;
                user = await user.save();
                return res.status(200).send(user);
            } else return res.sendStatus(400);
        } catch(err) {
            return res.status(400).send(err);
        }
    },
    ping: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let uid = jwt.verify(token, process.env.SECRETKEY).uid;
            let user = await Model.findOne({_id: uid});
            if (!user) return res.sendStatus(400);
            let asset = await fetchAssets(user.secretKey, user.apiKey);
            if (!asset.assets) return res.status(200).send({connected: true, apikey: false});
            return res.status(200).send({connected: true, apikey: true});
        } catch(err) {
            return res.status(400).send(err);
        }
    }
}