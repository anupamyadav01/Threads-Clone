import express from "express";
import {
  followAndUnfollowUser,
  login,
  logout,
  signup,
} from "../controllers/userController.js";

export const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.post("/follow/:userId", followAndUnfollowUser);
