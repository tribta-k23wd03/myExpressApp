import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";

export const getProfile = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};
