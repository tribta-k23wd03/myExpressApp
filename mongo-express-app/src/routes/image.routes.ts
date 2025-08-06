import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { uploadImage } from "../controllers/image.controller";
import { cloudinaryUpload } from "../utils/cloudinaryUpload";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  cloudinaryUpload.single("image"),
  uploadImage
);

export default router;
