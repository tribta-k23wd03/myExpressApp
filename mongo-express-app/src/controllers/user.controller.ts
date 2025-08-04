import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { User } from "../models/User";

export const getProfile = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, email } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user?.id,
    { name, email },
    { new: true }
  );

  res.json({ user: updated });
};
