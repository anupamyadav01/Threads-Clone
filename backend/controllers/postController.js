import mongoose from "mongoose";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";

export const createPost = async (req, res) => {
  const currentUser = req.user;
  try {
    const { postedBy, content, img } = req.body;
    if (!postedBy || !content) {
      return res
        .status(400)
        .json({ message: "Invalid input: postedBy or content missing" });
    }

    if (currentUser._id.toString() !== postedBy.toString()) {
      return res.status(401).json({
        message: "Unauthorized: You can only create posts for yourself",
      });
    }

    const maxLength = 500;
    if (content.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Content must be less than ${maxLength} characters` });
    }
    // const updatedPostedBy = new mongoose.Types.ObjectId(postedBy);
    const postObj = {
      postedBy: new mongoose.Types.ObjectId(postedBy),
      content,
      img: req.secure_url || img,
    };

    const newPost = await PostModel.create(postObj);

    const populatedPost = await newPost.populate("postedBy");

    return res.status(201).json({
      message: "Post created successfully",
      data: populatedPost,
    });
  } catch (error) {
    console.log("Error from createPost:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Invalid input: postId missing" });
    }

    const updatedPostId = new mongoose.Types.ObjectId(postId);

    const post = await PostModel.findById(updatedPostId).populate({
      path: "replies.userId", // Populate the userId inside replies
      select: "username profilePic", // Select only the fields you need
    });
    if (post) {
      return res.status(200).json({
        message: "Post fetched successfully",
        data: post,
      });
    } else {
      return res.status(404).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log("Error from getPostById:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const currentUser = req.user;
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Invalid input: postId missing" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (currentUser._id.toString() !== post.postedBy.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You can only delete your own posts" });
    }

    const updatedPostId = new mongoose.Types.ObjectId(postId);

    const deletedPost = await PostModel.findByIdAndDelete(updatedPostId);

    return res.status(200).json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    console.log("Error from deletePostById:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  const { postId } = req.params;
  const currentUser = req.user;

  try {
    if (!postId) {
      return res.status(400).json({ message: "Invalid input: postId missing" });
    }

    // Fetch the post by ID
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user is trying to like their own post
    if (currentUser._id.toString() === post.postedBy.toString()) {
      return res.status(400).json({
        message: "Unauthorized: You can't like your own post",
      });
    }

    const userLikedPost = post.likes.includes(currentUser._id);

    if (userLikedPost) {
      // Unlike the post by removing the user's ID from the likes array
      await PostModel.updateOne(
        { _id: postId },
        { $pull: { likes: currentUser._id } }
      );
      return res.status(200).json({
        message: "Post unliked successfully",
        data: {
          ...post.toObject(),
          likes: post.likes.filter(
            (id) => id.toString() !== currentUser._id.toString()
          ),
        },
      });
    } else {
      // Like the post by adding the user's ID to the likes array
      await PostModel.updateOne(
        { _id: postId },
        { $push: { likes: currentUser._id } }
      );
      return res.status(200).json({
        message: "Post liked successfully",
        data: { ...post.toObject(), likes: [...post.likes, currentUser._id] },
      });
    }
  } catch (error) {
    console.log("Error from likeUnlikePost:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const replyToPost = async (req, res) => {
  const { postId } = req.params;

  try {
    if (!postId) {
      return res.status(400).json({ message: "Invalid input: postId missing" });
    }

    const { _id } = req.user; // Extract only userId from req.user
    const { replyText } = req.body;

    if (!replyText || replyText.trim() === "") {
      return res.status(400).json({ message: "Invalid input: reply missing" });
    }

    const reply = {
      userId: new mongoose.Types.ObjectId(_id),
      replyText: replyText.trim(),
    };

    // Update the post to push the new reply to the replies array
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $push: { replies: reply } },
      { new: true }
    ).populate({
      path: "replies.userId", // Populate the userId inside replies
      select: "username profilePic", // Select only the fields you need
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(updatedPost); // Return only the updated post object
  } catch (error) {
    console.log("Error from replyToPost:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getFeeds = async (req, res) => {
  const currentUser = req.user;
  try {
    const following = currentUser.following;

    // If the user is not following anyone, return an empty array
    if (!following || following.length === 0) {
      return res.status(200).json({
        message: "No posts to show",
        data: [],
      });
    }

    // Fetch posts from users the current user is following
    const feedPosts = await PostModel.find({
      postedBy: { $in: following },
    })
      .populate("postedBy")
      .sort({ createdAt: -1 }); // Populate user data

    return res.status(200).json({
      message: "Posts fetched successfully",
      data: feedPosts,
    });
  } catch (error) {
    console.log("Error from getFeeds:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getPostsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) {
      return res
        .status(400)
        .json({ message: "Invalid input: username missing" });
    }

    // Check whether the username exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the posts by the user's _id, sort them by 'createdAt' in descending order
    const posts = await PostModel.find({ postedBy: user._id })
      .populate("postedBy")
      .sort({ createdAt: -1 }); // Sort in descending order

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log("Error from getPostsByUsername:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
