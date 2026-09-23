import express from "express";

const postRoutes = express.Router();

import {
  createPost,
  deletePostById,
  getFeeds,
  getFollowingFeed,
  getPostById,
  getPostsByUsername,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";
import uploadToCloudinary from "../middlewares/cloudniaryUpload.js";
import optionalAuth from "../middlewares/optionalAuth.js";

postRoutes.get("/feeds", optionalAuth, getFeeds);

postRoutes.get("/following", getUserDetails, getFollowingFeed);

postRoutes.get("/user/:username", getPostsByUsername);

// postRoutes.get("/feed", getFeedPosts);

postRoutes.post("/create", getUserDetails, uploadToCloudinary, createPost);

postRoutes.put("/like/:postId", getUserDetails, likeUnlikePost);

postRoutes.put("/reply/:postId", getUserDetails, replyToPost);

postRoutes.delete("/:postId", getUserDetails, deletePostById);

postRoutes.get("/:postId", getPostById);

export default postRoutes;
