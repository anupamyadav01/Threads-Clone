import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/userRoutes.js";
import connectToMongoDB from "./services/connectToMongoDB.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB Atlas
connectToMongoDB();

const PORT = process.env.PORT || 10000;

// Dynamically set CORS origin based on environment
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://threads-bro.vercel.app"
    : "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

// Start the server
app.listen(PORT, () => {
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
