import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudniary = async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const { profilePic } = req.body;
  try {
    if (req.user.profilePic) {
      await cloudinary.uploader.destroy(
        req.user.profilePic.split("/").pop().split(".")[0]
      );
    }
    const result = await cloudinary.uploader.upload(profilePic, {
      folder: "threads-clone",
      timeout: 60000,
    });
    console.log("Upload to Cloudniary Executed");
    req.secure_url = result.secure_url;
    next();
  } catch (error) {
    console.log("Error from uploadToCloudniary", error);
    res.status(500).json({
      success: false,
      message: "Unable to upload image, please try again later.",
    });
  }
};
