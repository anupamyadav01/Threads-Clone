import express from "express";
import {
  getConversationModels,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";
import uploadToCloudinary from "../middlewares/cloudniaryUpload.js";

const messageRoutes = express.Router();

messageRoutes.get("/conversations", getUserDetails, getConversationModels);
messageRoutes.get("/:otherUserId", getUserDetails, getMessages);
messageRoutes.post("/", getUserDetails, uploadToCloudinary, sendMessage);

export default messageRoutes;
