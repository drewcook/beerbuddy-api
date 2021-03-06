const request = require("supertest");
const { User } = require("../../models/User");
const { List } = require("../../models/List");

let server;

describe("auth middleware", () => {
	beforeEach(() => {
		server = require("../../index");
	});
	afterEach(async () => {
		await server.close();
		await List.deleteMany({});
	});

	let token;

	// define happy path fn
	const exec = () => {
		return request(server)
			.get("/api/lists")
			.set("authorization", `Bearer ${token}`);
	};

	beforeEach(() => {
		token = new User().generateAuthToken();
	});

	test("should return 401 if no token is provided", async () => {
		token = "";
		const res = await exec();

		expect(res.status).toBe(401);
	});

	test("should return 400 if token passed is invalid", async () => {
		token = "a";
		const res = await exec();

		expect(res.status).toBe(400);
	});

	test("should return 200 if token passed is valid", async () => {
		const res = await exec();

		expect(res.status).toBe(200);
	});
});
