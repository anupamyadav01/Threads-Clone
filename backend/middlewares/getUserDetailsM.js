import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const getUserDetails = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("token", token);

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in getUserDetails:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
      });
    }

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

export default getUserDetails;
