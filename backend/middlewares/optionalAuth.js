import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // User is not logged in
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId).select("-password");

    // Token exists but user doesn't
    if (!user) {
      req.user = null;
      return next();
    }

    // User is logged in
    req.user = user;

    next();
  } catch (error) {
    // For this route, invalid/expired token
    // should simply behave like a guest
    req.user = null;
    next();
  }
};

export default optionalAuth;
