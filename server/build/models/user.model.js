"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../@types/enum.types");
//?user schema
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: [true, "first_name is required"],
    },
    last_name: {
        type: String,
        required: [true, "last_name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "user already exists with provide email"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6,
        select: false, // never returned by default — must use .select("+password")
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER,
    },
    profile_image: {
        type: {
            path: String,
            public_id: String,
        },
    },
    phone: {
        type: String,
    },
}, { timestamps: true });
//? user model
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
