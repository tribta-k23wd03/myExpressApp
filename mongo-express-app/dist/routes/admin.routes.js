"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_middlewares_1 = require("../middlewares/admin.middlewares");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.get("/users", auth_middlewares_1.authMiddleware, admin_middlewares_1.requireAdmin, admin_controller_1.getAllUsers);
exports.default = router;
