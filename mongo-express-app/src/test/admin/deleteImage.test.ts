import request from "supertest";
import app from "../../app";
import { Image } from "../../models/Image";
import mongoose from "mongoose";

// MOCK Cloudinary
jest.mock("../../config/cloudinary", () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

describe("DELETE /api/admin/images/:id", () => {
  let token: string;
  let imageId: string;

  beforeAll(async () => {
    // Giả lập: tạo user admin và login
    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@test.com",
      password: "admin123",
    });

    // cập nhật role → admin
    await mongoose.connection
      .db!.collection("users")
      .updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });

    token = loginRes.body.accessToken;

    // Tạo ảnh giả
    const image = await Image.create({
      user: new mongoose.Types.ObjectId(),
      filename: "fake.jpg",
      description: "test img",
      visibility: "public",
      status: "pending",
      publicId: "fake-cloudinary-id",
    });

    imageId = image.id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should delete image and call cloudinary destroy", async () => {
    const res = await request(app)
      .delete(`/api/admin/images/${imageId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Image deleted");

    // xác nhận gọi đúng cloudinary.uploader.destroy
    const { cloudinary } = require("../../src/config/cloudinary");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
      "fake-cloudinary-id"
    );
  });
});
