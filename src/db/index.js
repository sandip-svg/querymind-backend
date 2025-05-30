import donenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

donenv.config({
  path: "./.env",
});

const connectDB = async () => {
  const MAX_RETRIES = 3;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGODB_URI}/${DB_NAME}`,
        {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      );
      console.log(
        `MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`
      );
      return;
    } catch (error) {
      retryCount++;
      console.error(`MongoDB Connection Attempt ${retryCount} failed:`);

      if (retryCount === MAX_RETRIES) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
};

export default connectDB;
