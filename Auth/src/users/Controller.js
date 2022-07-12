const Model = require("./Model");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRETKEY;
const fetchAssets = require("./api/fetch-assets");

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
    updateAPIKey: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let uid = jwt.verify(token, process.env.SECRETKEY).uid;
            let user = await Model.findOne({_id: uid});
            let asset = await fetchAssets(req.body.secretKey, req.body.apiKey);
            if (!user || !asset.assets) return res.sendStatus(400);
            user.apiKey = req.body.apiKey;
            user.secretKey = req.body.secretKey;
            let u = await user.save();
            return res.status(200).send(u);
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