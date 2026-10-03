"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtp_config = exports.jwt_config = exports.cloudinary_config = exports.db_config = void 0;
exports.db_config = {
    db_name: process.env.DB_NAME || "",
    db_uri: process.env.DB_URI || "",
};
exports.cloudinary_config = {
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINARR_API_KEY,
    secret_key: process.env.CLOUDINAR_SECRET_KEY,
};
exports.jwt_config = {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN
};
exports.smtp_config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
};
