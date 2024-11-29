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

app.use(
  cors({
    origin: ["https://threads-bro.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
connectToMongoDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal Server Error";
  res.status(statusCode).send(message);
});
