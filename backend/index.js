import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { userRoutes } from "./routes/userRoutes.js";
import connectToMongoDB from "./services/connectToMongoDB.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

const allowedOrigins = [
  "https://threads-clone-9tz3ac0z-anupam-yadavs-projects-116dc8a6.vercel.app",
  "https://threads-bro.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToMongoDB();

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).send(message);
});
