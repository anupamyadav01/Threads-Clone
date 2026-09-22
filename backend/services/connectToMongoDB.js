import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    (await mongoose.connect(process.env.MONGODB_URI),
      {
        autoSelectFamily: false,
      });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectToMongoDB;
