import mongoose from "mongoose";

const connectToMongoDB = async () => {
  const db_password = process.env.MONGODB_PASSWORD;

  try {
    (await mongoose.connect(
      `mongodb+srv://forlaptop21_db_user:${db_password}@cluster0.u4qdjze.mongodb.net/?appName=Cluster0`,
    ),
      {
        autoSelectFamily: false,
      });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectToMongoDB;
