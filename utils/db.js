import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // TLS options to fix the connection error
        tls: true,
        tlsAllowInvalidCertificates: true, // This handles certificate validation
        serverSelectionTimeoutMS: 30000, // Increase timeout
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4
      }
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
