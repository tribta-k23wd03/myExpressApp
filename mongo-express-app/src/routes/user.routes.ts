import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { getProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", authMiddleware, getProfile);

export default router;
