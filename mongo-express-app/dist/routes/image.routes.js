"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const image_controller_1 = require("../controllers/image.controller");
const upload_1 = require("../utils/upload");
const router = (0, express_1.Router)();
router.post("/upload", auth_middlewares_1.authMiddleware, upload_1.upload.single("image"), image_controller_1.uploadImage);
exports.default = router;
