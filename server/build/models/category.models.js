"use strict";
//name , description , image
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//? category schema
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: [true, "Category name must be unique"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Category description is required"],
        trim: true,
    },
    image: {
        type: {
            path: {
                type: String,
                required: [true, "Image path is required"],
            },
            public_id: {
                type: String,
                required: [true, "Image public_id is required"],
            },
        },
        required: false, // optional if category can exist without an image
    },
}, { timestamps: true });
//? category model
const Category = mongoose_1.default.model("category", categorySchema);
exports.default = Category;
