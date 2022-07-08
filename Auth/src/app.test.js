let request = require("supertest");
let app = require("./app");
let Model = require("./users/Model");
require("./db/mongoose");

const userOne = {
    username: "username",
    password: "password",
    apiKey: "test",
    secretKey: "test",
}

const userTwo = {
    username: "username1",
    password: "password"
}

const userThree = {
    username: "username2",
    password: "password"
}

beforeEach(async () => {
    await Model.deleteMany();
    let model = new Model(userOne);
    await model.save();
});

describe("POST /register", () => {
    it("should respond with 201 status code", async () => {
        let response = await request(app).post("/register").send(userTwo);
        expect(response.statusCode).toBe(201);
    });

    it("should respond with token", async () => {
        let response = await request(app).post("/register").send(userTwo);
        expect(typeof response.body.token).toBe("string");
    });

    it("should respond with a different user password", async () => {
        let response = await request(app).post("/register").send(userTwo);
        expect(response.body.password).not.toEqual(userTwo.password);
    });

    it("should respond with 400 status code", async () => {
        let response = await request(app).post("/register").send(userOne);
        expect(response.statusCode).toBe(400);
    });
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

    it("should respond with 200 status code", async () => {
        let response = await request(app).post("/login").send(userOne);
        let token = response.body.token;
        let sign = await request(app).post("/update-api").set({"Authorization": "Barear "+token}).send({
            apiKey: "test",
            secretKey: "test"
        });
        expect(sign.statusCode).toBe(200);
    });
});

describe("GET /get-keys", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).post("/login").send(userOne);
        let token = response.body.token;
        let keys = await request(app).get("/get-keys").set({"Authorization": "Barear "+token});
        console.log(keys.body);
        expect(keys.status).toBe(200);
    });
});