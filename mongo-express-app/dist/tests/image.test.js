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
jest.setTimeout(30000);
let token;
const TEST_USER = {
    name: "Image Test",
    email: "imgtest@example.com",
    password: "123456",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.User.deleteMany({ email: TEST_USER.email });
    yield Image_1.Image.deleteMany({ description: "Test image" });
    let res = yield (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(TEST_USER);
    if (![201, 200].includes(res.statusCode)) {
        res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: TEST_USER.email, password: TEST_USER.password });
    }
    expect(res.body).toHaveProperty("accessToken");
    token = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
describe("Image API", () => {
    let uploadedImgId;
    it("should upload image", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/images/upload")
            .set("Authorization", `Bearer ${token}`)
            .field("description", "Test image")
            .field("visibility", "public")
            .attach("image", path_1.default.join(__dirname, "./sample.jpg"));
        if (res.statusCode !== 201) {
            console.log("UPLOAD ERROR:", res.body, res.text);
        }
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("image");
        expect(res.body.image).toHaveProperty("description", "Test image");
        expect(res.body.image).toHaveProperty("user");
        expect(res.body.image).toHaveProperty("imageUrl");
        expect(res.body.image).toHaveProperty("publicId");
        uploadedImgId = res.body.image._id || res.body.image.id;
    }));
    it("should get all approved images", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/images");
        if (res.statusCode !== 200) {
            console.log("GET IMAGES ERROR:", res.body, res.text);
        }
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.images)).toBe(true);
    }));
});
