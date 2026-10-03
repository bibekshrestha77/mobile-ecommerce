"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.me = exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utlis_1 = require("../utils/jwt.utlis");
//? register user
exports.register = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    console.log("Register request body:", req.body);
    console.log("Register request file:", req.file);
    const { first_name, last_name, email, password, phone } = req.body;
    const file = req.file;
    if (!first_name || !last_name) {
        throw new error_handler_middleware_1.default("First name and last name are required", 400);
    }
    if (!email) {
        throw new error_handler_middleware_1.default("Email is required", 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default("Password is required", 400);
    }
    const user = new user_model_1.default({ first_name, last_name, email, phone });
    const hashedPass = await (0, bcrypt_utils_1.hashPassword)(password);
    // update user password to hashed password
    user.password = hashedPass;
    //! image
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file?.path, "/profile_images");
        user.profile_image = {
            path: path,
            public_id,
        };
    }
    //! save user
    await user.save();
    // never leak the password hash in the response
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({
        message: "Account created",
        status: "success",
        data: safeUser,
    });
});
//? login
exports.login = (0, asynchandler_utils_1.asyncHandler)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default("Email is required", 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default("Password is required", 400);
    }
    //* check if user exists
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new error_handler_middleware_1.default("email or password does not match", 400);
    }
    //* compare password
    const isPassMatch = await (0, bcrypt_utils_1.comparePassword)(password, user?.password || "");
    if (!isPassMatch) {
        throw new error_handler_middleware_1.default("email or password does not match", 400);
    }
    //! generate jwt token
    const access_token = (0, jwt_utlis_1.generateToken)({
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
    });
    // Send welcome/login email (not registration email)
    // sendRegistrationSuccessEmail(user); // Commented out - wrong email for login
    const isDevelopment = process.env.NODE_ENV === "development";
    // never leak the password hash in the response
    const safeUser = user.toObject();
    delete safeUser.password;
    res
        .cookie("access_token", access_token, {
        sameSite: isDevelopment ? "lax" : "none",
        httpOnly: true,
        secure: isDevelopment ? false : true,
        maxAge: Number(process.env.COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000,
    })
        .status(200) // 200 for login, not 201
        .json({
        message: "Login successful",
        status: "success",
        data: safeUser,
    });
});
//! logout
exports.logout = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    res.clearCookie("access_token", {
        sameSite: isDevelopment ? "lax" : "none",
        httpOnly: true,
        secure: isDevelopment ? false : true,
    });
    res.status(200).json({
        message: "Logged out successfully",
        status: "success",
    });
});
// change pass
// const changePassword = asyncHandler(async (req:Request,res:Response) => {
//     // api logic
// })
//! get user profile
exports.me = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const id = req.user?._id;
    const user = await user_model_1.default.findOne({ _id: id });
    res.status(200).json({
        data: user,
        message: "Profile fetched",
    });
});
//! update profile (name, phone)
exports.updateProfile = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const id = req.user?._id;
    const { first_name, last_name, phone } = req.body;
    if (!first_name && !last_name && phone === undefined) {
        throw new error_handler_middleware_1.default("Nothing to update", 400);
    }
    const updates = {};
    if (first_name)
        updates.first_name = String(first_name).trim();
    if (last_name)
        updates.last_name = String(last_name).trim();
    if (phone !== undefined)
        updates.phone = String(phone).trim();
    const user = await user_model_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!user) {
        throw new error_handler_middleware_1.default("User not found", 404);
    }
    res.status(200).json({
        message: "Profile updated",
        status: "success",
        data: user,
    });
});
//! change password
exports.changePassword = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const id = req.user?._id;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
        throw new error_handler_middleware_1.default("current_password and new_password are required", 400);
    }
    if (String(new_password).length < 6) {
        throw new error_handler_middleware_1.default("New password must be at least 6 characters", 400);
    }
    const user = await user_model_1.default.findOne({ _id: id }).select("+password");
    if (!user) {
        throw new error_handler_middleware_1.default("User not found", 404);
    }
    const isMatch = await (0, bcrypt_utils_1.comparePassword)(String(current_password), user.password || "");
    if (!isMatch) {
        throw new error_handler_middleware_1.default("Current password is incorrect", 400);
    }
    user.password = await (0, bcrypt_utils_1.hashPassword)(String(new_password));
    await user.save();
    res.status(200).json({
        message: "Password changed successfully",
        status: "success",
    });
});
