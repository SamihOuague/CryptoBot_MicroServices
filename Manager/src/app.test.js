const request = require("supertest");
const app = require("./app");
const Model = require("./managers/Model");
require("./db/mongoose");

beforeEach(async () => {
    await Model.deleteMany({});
    let pair = new Model({
        symbol: "BNBUSDT",
        actived: false
    });
    await pair.save();
});

describe("GET /get-assets", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/get-assets").send();
        expect(response.status).toBe(200);
    });

    it("Should respond with baseAssets", async () => {
        let response = await request(app).get("/get-assets").send();
        expect(response.body.baseAsset).toBeDefined();
    });
});

describe("/GET manager", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/bnbusdt").send();
        expect(response.status).toBe(200);
    });

    it("Should respond with false actived value", async () => {
        let response = await request(app).get("/bnbusdt").send();
        expect(response.body.actived).toBeDefined();
    });
});

describe("/POST manager", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).post("/switch/bnbusdt").send();
        expect(response.status).toBe(200);
    });

    it("Should respond with true actived attr value", async () => {
        let response = await request(app).post("/switch/bnbusdt").send();
        expect(response.body.actived).toBe(true);
    });
});

describe("POST /sell-position", () => {
    it("Should respond with disabled value", async () => {
        let response = await request(app).post("/sell-position").send();
        expect(response.body.disabled).toBeDefined();
    });

    //it("Should respond with 200 status code", async () => {
    //    await request(app).post("/switch/bnbusdt").send();
    //    let response = await request(app).post("/sell-position").send();
    //    expect(response.status).toBe(200);
    //});
    //it("Should repay position", async () => {
    //    let response = await request(app).post("/repay-position").send();
    //    console.log(response.body);
    //});
});