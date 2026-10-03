import cloudinary from "../config/cloudinary.config";
import CustomError from "../middlewares/error_handler.middleware";
import fs from "fs";
import path from "path";

export const upload = async (file: string, dir: string = "/") => {
  try {
    const cloudinaryConfig = cloudinary.config();
    const isCloudinaryConfigured = cloudinaryConfig && cloudinaryConfig.cloud_name;

    // Development fallback: save locally if Cloudinary not configured
    if (!isCloudinaryConfigured && process.env.NODE_ENV === "development") {
      const uploadsDir = path.join(__dirname, "../../uploads", dir.replace(/^\//, ""));
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const fileName = path.basename(file);
      const destPath = path.join(uploadsDir, fileName);
      fs.copyFileSync(file, destPath);
      
      // delete image from uploads folder
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
      
      return {
        public_id: fileName,
        path: `/api/uploads/${dir.replace(/^\//, "")}/${fileName}`,
      };
    }

    const folder = "/class_1_30_3_com" + dir;

    //upload image to from uploads folder
    const { public_id, secure_url } = await cloudinary.uploader.upload(file, {
      folder,
      unique_filename: true,
    });

    // delete image from uploads folder
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    return {
      public_id,
      path: secure_url,
    };
  } catch (error) {
    console.log("Upload error:", error);
    throw new CustomError("File upload error", 500);
  }
};

export const deleteFile = async (public_id: string) => {
  try {
    const isCloudinaryConfigured = cloudinary.config().cloud_name;

    if (!isCloudinaryConfigured && process.env.NODE_ENV === "development") {
      // Find and delete local file
      const uploadsDir = path.join(__dirname, "../../uploads");
      const findFile = (dir: string): string | null => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            const found = findFile(fullPath);
            if (found) return found;
          } else if (item.includes(public_id)) {
            return fullPath;
          }
        }
        return null;
      };
      const filePath = findFile(uploadsDir);
      if (filePath) {
        fs.unlinkSync(filePath);
      }
      return;
    }

    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new CustomError("File delete error", 500);
  }
};
