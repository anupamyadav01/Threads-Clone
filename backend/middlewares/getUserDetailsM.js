import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const getUserDetails = async (req, res, next) => {
  try {
    let token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        error: "Token Expired!! Please login again...",
      });
    }

    // Verify token
    const respo = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user by ID
    const user = await UserModel.findOne({ _id: respo.userId });
    if (!user) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error In GetUserDetails:", error.message);
    res.status(500).json({
      error: "Something went wrong, please try again later.",
      error: error.message,
    });
  }
};

export default getUserDetails;
