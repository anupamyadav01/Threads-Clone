import express from "express";
import {
  createPost,
  deletePostById,
  getFeeds,
  getPostById,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";
import uploadToCloudinary from "../middlewares/cloudniaryUpload.js";
const postRoutes = express.Router();

postRoutes.get("/feeds", getUserDetails, getFeeds);
postRoutes.get("/:postId", getPostById);
postRoutes.post("/create", getUserDetails, uploadToCloudinary, createPost);
postRoutes.delete("/:postId", getUserDetails, deletePostById);

postRoutes.post("/like/:postId", getUserDetails, likeUnlikePost);
postRoutes.post("/reply/:postId", getUserDetails, replyToPost);

export default postRoutes;
