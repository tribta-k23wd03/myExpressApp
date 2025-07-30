import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

// route http method GET/POST/PUT/DELETE
app.use("/api/auth", authRoutes);

export default app;
