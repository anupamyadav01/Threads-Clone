import express from "express";
import {
  checkLoggedIn,
  followUnFollowUser,
  forgotPassword,
  freezeAccount,
  getSuggestedUsers,
  getUserProfile,
  login,
  logout,
  resetPassword,
  signup,
  updateUserProfile,
  verifyOTP,
} from "../controllers/userController.js";
import getUserDetails from "../middlewares/getUserDetailsM.js";

export const userRoutes = express.Router();

// authentication and authorization routes
userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.post("/isLoggedIn", getUserDetails, checkLoggedIn);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/verify-otp", verifyOTP);
userRoutes.post("/reset-password", resetPassword);

userRoutes.get("/profile/:query", getUserProfile);
userRoutes.post("/follow/:queryId", getUserDetails, followUnFollowUser);
userRoutes.put("/update/:userId", getUserDetails, updateUserProfile);

// userRoutes.get("/suggested", protectRoute, getSuggestedUsers);
// userRoutes.put("/freeze", protectRoute, freezeAccount);

export default userRoutes;
