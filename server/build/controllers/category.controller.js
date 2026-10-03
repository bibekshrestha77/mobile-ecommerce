"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const category_models_1 = __importDefault(require("../models/category.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const dir = "/categories";
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const category = await category_models_1.default.find({});
    res.status(200).json({
        message: "Category fetched",
        status: "success",
        data: category,
    });
});
//get by id
exports.getById = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params; //id = req.params.id
    const category = await category_models_1.default.findById(id);
    if (!category) {
        throw new error_handler_middleware_1.default("Category not found", 404);
    }
    res.status(200).json({
        message: "Category fetched",
        status: "success",
        data: category,
    });
});
//create
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!file) {
        throw new error_handler_middleware_1.default("image is required", 400);
    }
    const category = new category_models_1.default({ name, description });
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file.path, dir);
    category.image = {
        path,
        public_id,
    };
    category.save();
    res.status(201).json({
        message: "Category created",
        status: "success",
        data: category,
    });
});
//update
exports.update = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const category = await category_models_1.default.findOne({ _id: id });
    if (!category) {
        throw new error_handler_middleware_1.default("Category not found", 400);
    }
    if (name) {
        category.name = name;
    }
    if (description) {
        category.description = description;
    }
    if (file) {
        if (category.image) {
            //delete old image
            await (0, cloudinary_utils_1.deleteFile)(category.image?.public_id);
        }
        //upload new image
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file.path, dir);
        category.image = {
            path,
            public_id,
        };
        await category.save();
        res.status(201).json({
            message: "Category updated",
            data: category,
            status: "success",
        });
    }
});
//delete
exports.remove = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const category = await category_models_1.default.findById(id);
    if (!category) {
        throw new error_handler_middleware_1.default("Category not found", 404);
    }
    // Delete image from Cloudinary if it exists
    if (category.image && category.image.public_id) {
        await (0, cloudinary_utils_1.deleteFile)(category.image.public_id);
    }
    await category.deleteOne();
    res.status(200).json({
        message: "Category deleted successfully",
        status: "success",
    });
});
