import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { User } from "../models/User";

jest.setTimeout(30000);

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  };

  beforeEach(async () => {
    await User.deleteMany({ email: testUser.email });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    if (res.statusCode !== 201)
      console.log("REGISTER ERROR:", res.body, res.text);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("should not register with existing email", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const res = await request(app).post("/api/auth/register").send(testUser);
    expect([400, 409]).toContain(res.statusCode);
  });

  it("should login successfully", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    if (res.statusCode !== 200) console.log("LOGIN ERROR:", res.body, res.text);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should not login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpass" });
    if (res.statusCode !== 401)
      console.log("LOGIN WRONG PASS ERROR:", res.body, res.text);
    expect(res.statusCode).toBe(401);
  });
});
