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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const Image_1 = require("../models/Image");
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file) {
        return res.status(400).json({ error: "Missing image file" });
    }
    const { description, visibility } = req.body;
    const newImage = new Image_1.Image({
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        fileName: req.file.filename,
        description,
        visibility: visibility === "private" ? "private" : "public",
        status: "pending",
    });
    const saved = yield newImage.save();
    res.status(201).json({
        message: "image uploaded. Awaiting admin approval!",
        image: saved,
    });
});
exports.uploadImage = uploadImage;
