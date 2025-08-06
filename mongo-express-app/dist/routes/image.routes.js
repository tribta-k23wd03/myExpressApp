"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = require("../controllers/image.controller");
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
const router = (0, express_1.Router)();
router.post("/upload", cloudinaryUpload_1.cloudinaryUpload.single("image"), image_controller_1.uploadImage);
router.get("/public", image_controller_1.getPublicImage);
exports.default = router;
