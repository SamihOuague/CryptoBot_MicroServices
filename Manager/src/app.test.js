const request = require("supertest");
const app = require("./app");
require("./db/mongoose");

describe("GET /get-assets", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/get-assets").send();
        expect(response.status).toBe(200);
    });

    it("Should respond with baseAssets", async () => {
        let response = await request(app).get("/get-assets").send();
        console.log(response.body);
        expect(response.body.baseAsset).toBeDefined();
    });
});

//describe("POST /sell-position", () => {
//it("Should borrow and sell all fund", async () => {
//    let response = await request(app).post("/sell-position").send();
//    console.log(response.body);
//});

//it("Should repay position", async () => {
//    let response = await request(app).post("/repay-position").send();
//    console.log(response.body);
//});
//});