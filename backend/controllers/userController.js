import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const { name, username, email, password } = req.body;
    // check if all fields are filled or not
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    // check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "failed", message: "User already exists" });
    }

    // check if username already exists
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ status: "failed", message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create a new user
    const response = await UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    if (response) {
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: response,
      });
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Invalid Credentials." });
    }

    // console.log("Response from signup controller: ", response);
  } catch (error) {
    console.log("Error from signup controller: ", error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to Signup, Try Again " });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required!!" });
    }

    // find user in db
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User not found, Check your credentials",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: "failed",
          message: "User not found, Check your credentials",
        });
      } else {
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
          status: "success",
          message: "User logged in successfully",
          data: user,
        });
      }
    }
  } catch (error) {
    console.log("Error from login controller: ", error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to Login, Try Again " });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "There was a problem logging out. Please try again.",
    });
  }
};

export const followAndUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
  } catch (error) {
    console.log("Error from followAndUnfollowUser controller: ", error);

    res.status(500).json({
      status: "fail",
      message:
        "There was a problem following or unfollowing user. Please try again.",
    });
  }
};
