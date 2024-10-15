import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/userRoutes.js";
import connectToMongoDB from "./services/connectToMongoDB.js";

const app = express();

dotenv.config();
connectToMongoDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
