"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadFile = () => {
    // creating multer instance
    const folder = "uploads";
    const file_size = 5 * 1024 * 1024; // 5mb
    const allowed_ext = ["jpg", "jpeg", "png", "webp", "svg"];
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
    //? storage
    const myStorage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + "-" + file.originalname;
            cb(null, fileName);
        },
    });
    const file_filter = (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).replace(".", "");
        const isAllowed = allowed_ext.includes(ext);
        if (isAllowed) {
            cb(null, true);
        }
        else {
            const message = `${ext} is not allowed. Only ${allowed_ext.join(",")} are allowed.`;
            cb(new Error(message), false);
        }
    };
    const upload = (0, multer_1.default)({
        storage: myStorage,
        limits: { fileSize: file_size },
        fileFilter: file_filter,
    });
    return upload;
};
exports.uploadFile = uploadFile;
