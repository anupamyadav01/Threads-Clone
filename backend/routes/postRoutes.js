import express from "express";
import {
  createPost,
  deletePostById,
  getFeeds,
  getPostById,
  getPostsByUsername,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";
import uploadToCloudinary from "../middlewares/cloudniaryUpload.js";
const postRoutes = express.Router();

postRoutes.get("/feeds", getUserDetails, getFeeds);
postRoutes.get("/:postId", getPostById);
postRoutes.get("/user/:username", getUserDetails, getPostsByUsername);
postRoutes.post("/create", getUserDetails, uploadToCloudinary, createPost);
postRoutes.delete("/:postId", getUserDetails, deletePostById);

postRoutes.put("/like/:postId", getUserDetails, likeUnlikePost);
postRoutes.put("/reply/:postId", getUserDetails, replyToPost);

export default postRoutes;
