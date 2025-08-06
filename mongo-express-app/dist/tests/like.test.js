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
const path_1 = __importDefault(require("path"));
const User_1 = require("../models/User");
const Image_1 = require("../models/Image");
const Like_1 = require("../models/Like");
jest.setTimeout(30000);
let token, imageId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.User.deleteMany({ email: "likeuser@example.com" });
    yield Image_1.Image.deleteMany({ description: "For Like" });
    yield Like_1.Like.deleteMany({});
    let res = yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send({
        name: "Like User",
        email: "likeuser@example.com",
        password: "123456",
    });
    if (![201, 200].includes(res.statusCode)) {
        res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "likeuser@example.com", password: "123456" });
    }
    token = res.body.accessToken;
    const resImg = yield (0, supertest_1.default)(app_1.default)
        .post("/api/images/upload")
        .set("Authorization", `Bearer ${token}`)
        .field("description", "For Like")
        .field("visibility", "public")
        .attach("image", path_1.default.join(__dirname, "./sample.jpg"));
    if (resImg.statusCode !== 201)
        console.log("UPLOAD IMAGE ERROR:", resImg.body, resImg.text);
    expect(resImg.statusCode).toBe(201);
    imageId = resImg.body.image._id || resImg.body.image.id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
describe("Like API", () => {
    it("should like image", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/images/${imageId}/like`)
            .set("Authorization", `Bearer ${token}`);
        if (res.statusCode !== 200)
            console.log("LIKE ERROR:", res.body, res.text);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
    }));
    it("should unlike image", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post(`/api/images/${imageId}/like`)
            .set("Authorization", `Bearer ${token}`);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/images/${imageId}/unlike`)
            .set("Authorization", `Bearer ${token}`);
        if (res.statusCode !== 200)
            console.log("UNLIKE ERROR:", res.body, res.text);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
    }));
});
