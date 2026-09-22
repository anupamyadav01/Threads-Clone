import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const getUserDetails = async (req, res, next) => {
  try {
    // 1. Extract token from HTTP-only cookie or Bearer Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: No token provided. Please log in.",
      });
    }

    // 2. Verify JWT signature & expiration
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Session expired. Please log in again.",
        });
      }
      return res.status(401).json({
        error: "Unauthorized: Invalid or corrupted token.",
      });
    }

    // 3. Locate user and strip confidential fields (password, otp)
    const user = await UserModel.findById(decoded.userId).select(
      "-password -otp",
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found or account has been deleted.",
      });
    }

    // 4. Attach verified user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({
      error: "Internal authentication error. Please try again later.",
    });
  }
};

export default getUserDetails;
