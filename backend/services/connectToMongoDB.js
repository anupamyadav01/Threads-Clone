import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    // mongoose.set("strictQuery", false);
    // mongoose.set("strictPopulate", false);
    await mongoose.connect(`${process.env.MONGODB_URI}/Threads-Clone`);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectToMongoDB;
