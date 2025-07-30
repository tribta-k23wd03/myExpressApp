import * as authService from "../services/auth.services";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json({ user });
};
export const login = async (req: Request, res: Response) => {
  const token = await authService.login(req.body);
  res.status(200).json({ token });
};
