const fetch = require("node-fetch");

module.exports = {
    ping: async (token) => {
        return await (await fetch("http://auth:3001/ping", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Barear " + token,
            }
        })).json();
    }
};