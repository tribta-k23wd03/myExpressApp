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
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe("Admin API - đơn giản", () => {
    let adminToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGO_ATLAS_URI || "mongodb://localhost:27017/test");
        yield User_1.User.deleteMany({ email: "admin@test.com" });
        const admin = yield User_1.User.create({
            name: "Admin",
            email: "admin@test.com",
            password: "$2b$10$CwTycUXWue0Thq9StjUM0uJ8pU1yUN/3Fzp8MZNw8yz.ZzN2pX7yG",
            role: "admin",
        });
        const resLogin = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "admin@test.com", password: "123456" });
        adminToken = resLogin.body.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it("GET /api/admin/users - trả về danh sách user khi là admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/admin/users")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users[0]).not.toHaveProperty("password");
        expect(res.body.users[0]).toHaveProperty("role");
    }));
});
