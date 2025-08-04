import { Router } from "express";
import { requireAdmin } from "../middlewares/admin.middlewares";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { getAllUsers } from "../controllers/admin.controller";

const router = Router();

router.get("/users", authMiddleware, requireAdmin, getAllUsers);

export default router;
