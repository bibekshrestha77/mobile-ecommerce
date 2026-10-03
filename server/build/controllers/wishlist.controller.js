"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.clearAll = exports.create = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const product_models_1 = __importDefault(require("../models/product.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
//* create
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user?._id;
    let wishlist = null;
    const product = await product_models_1.default.findOne({ _id: product_id });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    const is_exists = await wishlist_model_1.default.findOne({
        user: user_id,
        product: product_id,
    });
    if (is_exists) {
        await is_exists.deleteOne();
    }
    else {
        wishlist = await wishlist_model_1.default.create({ user: user_id, product: product._id });
    }
    res.status(201).json({
        message: is_exists
            ? "Prduct removed from wishlist"
            : "Prduct added to wishlist",
        data: wishlist,
        status: "success",
    });
});
//* clear list
exports.clearAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    await wishlist_model_1.default.deleteMany({ user: user_id });
    res.status(200).json({
        message: "Wislist cleared.",
        data: null,
        status: "success",
    });
});
//* get all
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const list = await wishlist_model_1.default.find({ user: user_id }).populate('user').populate('product');
    res.status(200).json({
        message: "Wislist fetched.",
        data: list,
        status: "success",
    });
});
