"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const brandSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'brand already exists with given name'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: {
            path: String,
            public_id: String
        },
        required: [true, 'image is required'],
    }
}, {
    timestamps: true
});
const Brand = mongoose_1.default.model('brand', brandSchema);
exports.default = Brand;
