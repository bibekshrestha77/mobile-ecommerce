"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.upload = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upload = async (file, dir = "/") => {
    try {
        const cloudinaryConfig = cloudinary_config_1.default.config();
        const isCloudinaryConfigured = cloudinaryConfig && cloudinaryConfig.cloud_name;
        // Development fallback: save locally if Cloudinary not configured
        if (!isCloudinaryConfigured && process.env.NODE_ENV === "development") {
            const uploadsDir = path_1.default.join(__dirname, "../../uploads", dir.replace(/^\//, ""));
            if (!fs_1.default.existsSync(uploadsDir)) {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
            const fileName = path_1.default.basename(file);
            const destPath = path_1.default.join(uploadsDir, fileName);
            fs_1.default.copyFileSync(file, destPath);
            // delete image from uploads folder
            if (fs_1.default.existsSync(file)) {
                fs_1.default.unlinkSync(file);
            }
            return {
                public_id: fileName,
                path: `/api/uploads/${dir.replace(/^\//, "")}/${fileName}`,
            };
        }
        const folder = "/class_1_30_3_com" + dir;
        //upload image to from uploads folder
        const { public_id, secure_url } = await cloudinary_config_1.default.uploader.upload(file, {
            folder,
            unique_filename: true,
        });
        // delete image from uploads folder
        if (fs_1.default.existsSync(file)) {
            fs_1.default.unlinkSync(file);
        }
        return {
            public_id,
            path: secure_url,
        };
    }
    catch (error) {
        console.log("Upload error:", error);
        throw new error_handler_middleware_1.default("File upload error", 500);
    }
};
exports.upload = upload;
const deleteFile = async (public_id) => {
    try {
        const isCloudinaryConfigured = cloudinary_config_1.default.config().cloud_name;
        if (!isCloudinaryConfigured && process.env.NODE_ENV === "development") {
            // Find and delete local file
            const uploadsDir = path_1.default.join(__dirname, "../../uploads");
            const findFile = (dir) => {
                const items = fs_1.default.readdirSync(dir);
                for (const item of items) {
                    const fullPath = path_1.default.join(dir, item);
                    const stat = fs_1.default.statSync(fullPath);
                    if (stat.isDirectory()) {
                        const found = findFile(fullPath);
                        if (found)
                            return found;
                    }
                    else if (item.includes(public_id)) {
                        return fullPath;
                    }
                }
                return null;
            };
            const filePath = findFile(uploadsDir);
            if (filePath) {
                fs_1.default.unlinkSync(filePath);
            }
            return;
        }
        await cloudinary_config_1.default.uploader.destroy(public_id);
    }
    catch (error) {
        throw new error_handler_middleware_1.default("File delete error", 500);
    }
};
exports.deleteFile = deleteFile;
