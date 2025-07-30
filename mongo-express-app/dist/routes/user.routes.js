"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/me", auth_middlewares_1.authMiddleware, user_controller_1.getProfile);
exports.default = router;
