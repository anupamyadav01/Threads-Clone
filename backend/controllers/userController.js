import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import generateOTP from "../utils/helpers/generateOTP.js";
import sendMail from "../utils/helpers/sendMail.js";
import mongoose, { Mongoose } from "mongoose";

export const signup = async (req, res) => {
  try {
    const { name, email, password, username } = req.body.inputs;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    // checking if user already exists
    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const isUsernameExist = await UserModel.findOne({ username });
    if (isUsernameExist) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
      name,
      username,
      email,
      password: hashedPassword,
    };
    const newlyCreatedUser = await UserModel.create(userData);

    if (newlyCreatedUser) {
      return res.status(201).json({
        message: "User created successfully",
        user: newlyCreatedUser,
      });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to create user, try again" });
    }
  } catch (error) {
    console.log("Error in Register User", error.message);
    return res.status(500).json({
      message: "Failed to create user, try again",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password, username } = req.body.inputs;
  try {
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Please enter email/username and password",
      });
    }
    let existingUser;
    if (email) {
      existingUser = await UserModel.findOne({ email });
    } else if (username) {
      existingUser = await UserModel.findOne({ username });
    }

    // user not found
    if (!existingUser) {
      return res.status(400).json({ error: "User Not Found" });
    }

    // checking if password is correct or not
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send({ error: "Password is Incorrect, try again" });
    }

    // if password is correct, create JWT token and // store token in cookie
    generateTokenAndSetCookie(existingUser._id, res);

    return res.status(200).json({
      message: "User Logged in Successfully.",
      user: existingUser,
    });
  } catch (error) {
    console.log("Error in Login", error);

    return res.status(500).json({
      error: "Internal server error",
      errorMsg: error.message,
    });
  }
};

export const checkLoggedIn = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      role: user.role,
      user,
    });
  } catch (error) {
    console.log("Error from Checklogged In", error);

    return res.status(500).json({
      message: "Something went wrong, please try again later.",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  try {
    // TODO = check in DB if email exists or not
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    // check in bd wheater user exists or not in database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const otpExpiryTime = 10; // 10 minutes expiry time
    const otp = generateOTP(); // Assuming generateOTP function returns an OTP code

    // Construct email body as an HTML string
    const actualBody = `
      <html>
        <head>
          <title>Password Reset OTP</title>
          <style>/* Your CSS styles here */</style>
        </head>
        <body>
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Password Reset OTP</h2>
            <p>Dear ${email},</p>
            <p>
              You recently requested to reset your password. Your OTP code is: <strong>${otp}</strong>
            </p>
            <p>This OTP will expire in ${otpExpiryTime} minutes.</p>
            <p>
              <a href="{{ reset_password_url }}">Reset Password</a>
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email
    const mailResponse = sendMail(email, "Reset Password", actualBody);
    if (mailResponse) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { $set: { otp } },
        { new: true }
      );
      if (updatedUser) {
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
          mailResponse,
        });
      }
    } else {
      return res.status(500).json({
        error: "Failed to send OTP, please try again later",
      });
    }
  } catch (error) {
    console.error("Error from reset password:", error);
    res.status(500).json({ error: "Server error, failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error from verify OTP:", error);
    res.status(500).json({ error: "Server error, failed to verify OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const checkUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (checkUser) {
      res.status(201).send({
        message: "Password Updated Sucessfully.",
      });
    }
  } catch (error) {
    console.log("Error from reset password:", error);

    return res.json({
      message: "errror in reset",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { query } = req.params;
    if (!query) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }
    const user = await UserModel.findOne({ username: query })
      .select("-password")
      .select("-otp")
      .select("-updatedAt");
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log("Error from getUserProfile:", error);
    return res.status(500).json({
      error: "Server error, failed to get user profile",
    });
  }
};

export const followUnFollowUser = async (req, res) => {
  const currentUser = req.user;
  try {
    const { queryId } = req.params;

    if (!queryId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }
    // prevent user from following himself
    if (queryId.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        error: "You cannot follow/unfollow yourself",
      });
    }
    // checking if user is already followed
    const isAlreadyFollowing = currentUser.following.find(
      (userId) => userId.toString() === queryId.toString()
    );
    const updatedQueryId = new mongoose.Types.ObjectId(queryId);

    if (isAlreadyFollowing) {
      // if user is already following, unfollow

      // removing user from following list of current user
      const updatedUser = await UserModel.findOneAndUpdate(
        currentUser._id,
        {
          $pull: { following: updatedQueryId },
        },
        {
          new: true,
        }
      );

      // now removing current user from followers list of that user.
      const updatedUser2 = await UserModel.findOneAndUpdate(
        updatedQueryId,
        {
          $pull: { followers: currentUser._id },
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      // user is not following yet, so follow now

      // adding user to following list of current user
      await UserModel.findOneAndUpdate(currentUser._id, {
        $push: {
          following: updatedQueryId,
        },
      });
      await UserModel.findOneAndUpdate(
        updatedQueryId,
        {
          $push: {
            followers: currentUser._id,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log("Error from followUnFollowUser:", error);

    return res.status(500).json({
      error: "Server error, failed to follow/unfollow user",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  // if we are here that means user is logged in and has a valid token and we can update user profile
  const currentUser = req.user;
  const cloudinaryURL = req.secure_url;
  const { name, username, bio, password, profilePic } = req.body;
  try {
    if (currentUser._id.toString() !== req.params.userId) {
      return res.status(400).json({
        error: "You can update only your profile",
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      currentUser.password = hashedPassword;
    }

    currentUser.name = name || currentUser.name;
    currentUser.username = username || currentUser.username;
    currentUser.bio = bio || currentUser.bio;
    currentUser.profilePic = cloudinaryURL || currentUser.profilePic;

    const updatedUserProfile = await currentUser.save();
    if (updateUserProfile) {
      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        updatedUserProfile,
      });
    } else {
      return res.status(400).json({
        error: "User profile update failed",
      });
    }
  } catch (error) {
    console.log("Error from updateUserProfile:", error);

    return res.status(500).json({
      error: "Server error, failed to update user profile",
    });
  }
};

export const freezeAccount = async (req, res) => {};

export const getSuggestedUsers = async (req, res) => {};
