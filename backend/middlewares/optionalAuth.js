import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

// Attaches req.user if a valid token exists, but proceeds anyway if not
const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.userId).select(
      "-password -otp",
    );
    next();
  } catch {
    req.user = null;
    next();
  }
};

export default optionalAuth;
