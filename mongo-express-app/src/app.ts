import express from "express";

const app = express();

app.use(express.json());

// route http method GET/POST/PUT/DELETE

export default app;
