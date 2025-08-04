import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Image } from "../models/Image";

export const uploadImage = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "Missing image file" });
  }

  const { description, visibility } = req.body;

  const newImage = new Image({
    user: req.user?.id,
    fileName: req.file.filename,
    description,
    visibility: visibility === "private" ? "private" : "public",
    status: "pending",
  });

  const saved = await newImage.save();

  res.status(201).json({
    message: "image uploaded. Awaiting admin approval!",
    image: saved,
  });
};
