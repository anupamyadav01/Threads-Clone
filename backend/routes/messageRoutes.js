import express from "express";
import {
  getMessages,
  sendMessage,
  getConversations,
} from "../controllers/messageController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";

const messageRoutes = express.Router();

messageRoutes.get("/conversations", getUserDetails, getConversations);
messageRoutes.get("/:otherUserId", getUserDetails, getMessages);
messageRoutes.post("/", getUserDetails, sendMessage);

export default messageRoutes;
