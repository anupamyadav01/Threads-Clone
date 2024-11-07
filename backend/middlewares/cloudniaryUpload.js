import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (req, res, next) => {
  const { img } = req.body;

  // Check if image is provided from frontend
  if (!img) {
    console.log("No image provided, skipping Cloudinary upload.");
    return next(); // Skip upload and proceed to the next middleware/controller
  }

  // Cloudinary config
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 120000, // Increase timeout to 120 seconds
  });

  try {
    // If user already has an image, destroy the old one
    if (req?.user && req.user.img) {
      await cloudinary.uploader.destroy(
        req.user.img.split("/").pop().split(".")[0]
      );
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(img, {
      folder: "threads-clone",
      timeout: 120000, // Increase timeout for upload
    });

    req.secure_url = result.secure_url; // Store uploaded image URL in req
    next();
  } catch (error) {
    console.error("Error in Cloudinary upload");
    console.error(error);
  }
};

export default uploadToCloudinary;
