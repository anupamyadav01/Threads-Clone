import express from "express";
import {
  getConversationModels,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";

const messageRoutes = express.Router();

messageRoutes.get("/conversations", getUserDetails, getConversationModels);
messageRoutes.get("/:otherUserId", getUserDetails, getMessages);
messageRoutes.post("/", getUserDetails, sendMessage);

export default messageRoutes;
