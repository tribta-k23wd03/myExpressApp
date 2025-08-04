import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { uploadImage } from "../controllers/image.controller";
import { upload } from "../utils/upload";

const router = Router();

router.get("/upload", authMiddleware, upload.single("image"), uploadImage);

export default router;
