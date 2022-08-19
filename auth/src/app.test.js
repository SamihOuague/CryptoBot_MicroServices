let request = require("supertest");
let app = require("./app");
let Model = require("./users/Model");
require("./db/mongoose");

const userOne = {
    username: "admin",
    password: "admin123",
}

const userThree = {
    username: "admin2",
    password: "admin123",
}

beforeEach(async () => {
    await Model.deleteMany({});
    let user = new Model({
        username: process.env.USERNAME,
        password: process.env.PWD
    });
    await user.save();
});


describe("POST /login", () => {
    it("should respond with 200 status code", async () => {
        let response = await request(app).post("/login").send(userOne);
        expect(response.statusCode).toBe(200);
    });

    it("should respond with token", async () => {
        let response = await request(app).post("/login").send(userOne);
        expect(typeof response.body.token).toBe("string");
    });

    it("should respond with 400 status code (wrong pwd)", async () => {
        let response = await request(app).post("/login").send({...userOne, password: "pwd123"});
        expect(response.statusCode).toBe(400);
    });

    it("should respond with 400 status code (wrong user)", async () => {
        let response = await request(app).post("/login").send(userThree);
        expect(response.statusCode).toBe(400);
    });

});

describe("POST /update-api", () => {
    it("should respond with 200 status code", async () => {
        let response = await request(app).post("/login").send(userOne);
        let token = response.body.token;
        let sign = await request(app).post("/update-api").set({"Authorization": "Barear "+token}).send({
            apiKey: "kM3WtbEleVRw2UzA5DSlSBWGnEeQ61b1j6Q4pK5AaNPrd57pKyRhdd0n0CSHuGXp",
            secretKey: "YPGFrZLqtJjWiMb5FvVnolaQwjLgLIUtqg3vZhdb4rHZuWu9y8KZunE4LlndOPBY"
        });
        expect(sign.statusCode).toBe(200);
    });
});