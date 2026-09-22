import express from "express";

const postRoutes = express.Router();

import {
  createPost,
  deletePostById,
  getFeedPosts,
  getFeeds,
  getPostById,
  getPostsByUsername,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";
import uploadToCloudinary from "../middlewares/cloudniaryUpload.js";

postRoutes.get("/feeds", getUserDetails, getFeeds);

postRoutes.get("/user/:username", getPostsByUsername);

postRoutes.get("/feed", getFeedPosts);

postRoutes.post("/create", getUserDetails, uploadToCloudinary, createPost);

postRoutes.put("/like/:postId", getUserDetails, likeUnlikePost);

postRoutes.put("/reply/:postId", getUserDetails, replyToPost);

postRoutes.delete("/:postId", getUserDetails, deletePostById);

postRoutes.get("/:postId", getPostById);

export default postRoutes;
