"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Image_1 = require("../models/Image");
jest.setTimeout(30000);
let adminToken, imageId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.User.deleteMany({ email: "adminuser@example.com" });
    yield Image_1.Image.deleteMany({ description: "Fake Image" });
    yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send({
        name: "Admin User",
        email: "adminuser@example.com",
        password: "123456",
        role: "admin",
    });
    const resLogin = yield (0, supertest_1.default)(app_1.default)
        .post("/api/auth/login")
        .send({ email: "adminuser@example.com", password: "123456" });
    adminToken = resLogin.body.accessToken;
    const adminUser = yield User_1.User.findOne({ email: "adminuser@example.com" });
    const fakeImage = yield Image_1.Image.create({
        user: adminUser === null || adminUser === void 0 ? void 0 : adminUser._id,
        imageUrl: "http://fakeimg.com/fake.jpg",
        publicId: "fake_public_id",
        description: "Fake Image",
        visibility: "public",
        status: "approved",
    });
    imageId = fakeImage.id.toString();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
describe("Admin API", () => {
    it("should delete image", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/images/${imageId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        if (res.statusCode !== 200)
            console.log("DELETE IMAGE ERROR:", res.body, res.text);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
    }));
});
