import { v2 as cloudinary } from "cloudinary";
import { cloudinary_config } from "./config";

// Only configure if real credentials are provided (not placeholders)
const hasRealCredentials = 
  cloudinary_config.cloud_name && 
  cloudinary_config.api_key && 
  cloudinary_config.secret_key &&
  !cloudinary_config.cloud_name.includes("your-") &&
  !cloudinary_config.api_key.includes("your-") &&
  !cloudinary_config.secret_key.includes("your-");

if (hasRealCredentials) {
  cloudinary.config({
    cloud_name: cloudinary_config.cloud_name,
    api_key: cloudinary_config.api_key,
    api_secret: cloudinary_config.secret_key,
  });
} else {
  console.warn("Cloudinary credentials not configured or using placeholders. Image uploads will use local storage in development.");
}

export default cloudinary;
