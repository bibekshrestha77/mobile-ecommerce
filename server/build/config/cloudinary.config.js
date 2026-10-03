"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = require("./config");
// Only configure if real credentials are provided (not placeholders)
const hasRealCredentials = config_1.cloudinary_config.cloud_name &&
    config_1.cloudinary_config.api_key &&
    config_1.cloudinary_config.secret_key &&
    !config_1.cloudinary_config.cloud_name.includes("your-") &&
    !config_1.cloudinary_config.api_key.includes("your-") &&
    !config_1.cloudinary_config.secret_key.includes("your-");
if (hasRealCredentials) {
    cloudinary_1.v2.config({
        cloud_name: config_1.cloudinary_config.cloud_name,
        api_key: config_1.cloudinary_config.api_key,
        api_secret: config_1.cloudinary_config.secret_key,
    });
}
else {
    console.warn("Cloudinary credentials not configured or using placeholders. Image uploads will use local storage in development.");
}
exports.default = cloudinary_1.v2;
