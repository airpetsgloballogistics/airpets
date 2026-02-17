import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    const mongoURI = process.env.MONGO;

    if (!mongoURI) {
      throw new Error("MONGO environment variable is not set");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    throw new Error("Could not connect to MongoDB");
  }
};

export default dbConnect;
