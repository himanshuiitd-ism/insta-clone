import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load .env (empty object ensures no path issues)
dotenv.config({});

// Validate required environment variables
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}`);
  }
}

// Configure Cloudinary with error handling
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Force HTTPS
    cdn_subdomain: true, // Better CDN performance
  });
} catch (error) {
  console.error("❌ Cloudinary config error:", error.message);
  throw new Error("Failed to initialize Cloudinary");
}

export default cloudinary;
