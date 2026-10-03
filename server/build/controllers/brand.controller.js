"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const dir = "/brand";
//get all
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const brand = await brand_model_1.default.find({});
    res.status(200).json({
        message: "Brand fetched",
        status: "success",
        data: brand,
    });
});
//get by id
exports.getById = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand not found", 404);
    }
    res.status(200).json({
        message: "Brand fetched",
        status: "success",
        data: brand,
    });
});
//create 
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!file) {
        throw new error_handler_middleware_1.default("image is required", 400);
    }
    const brand = new brand_model_1.default({ name, description });
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file.path, dir);
    brand.image = {
        path,
        public_id,
    };
    brand.save();
    res.status(201).json({
        message: "Brand created",
        status: "success",
        data: brand,
    });
});
//update
exports.update = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand not found", 400);
    }
    if (name) {
        brand.name = name;
    }
    if (description) {
        brand.description = description;
    }
    if (file) {
        if (brand.image) {
            //delete old image
            await (0, cloudinary_utils_1.deleteFile)(brand.image?.public_id);
        }
        //upload new image
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file.path, dir);
        brand.image = {
            path,
            public_id,
        };
        await brand.save();
        res.status(201).json({
            message: "Brand updated",
            data: brand,
            status: "success",
        });
    }
});
//delete
exports.remove = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand not found", 404);
    }
    // Delete image from Cloudinary if it exists
    if (brand.image && brand.image.public_id) {
        await (0, cloudinary_utils_1.deleteFile)(brand.image.public_id);
    }
    await brand.deleteOne();
    res.status(200).json({
        message: "Brand deleted successfully",
        status: "success",
    });
});
