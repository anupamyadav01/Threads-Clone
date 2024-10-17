import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

//This Middleware ensures that the user is logged in and has a valid token
export const getUserDetails = async (req, res, next) => {
  try {
    let token = null;

    // Check both cookie and authorization headers
    if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    } else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        error: "Token is required.",
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
    console.log("Error In GetUserDetails: ", error);
    res.status(500).json({
      error: "Something went wrong, please try again later.",
      error: error.message,
    });
  }
};

export default getUserDetails;
