"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.remove = exports.getCart = exports.create = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const product_models_1 = __importDefault(require("../models/product.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const cart_models_1 = __importDefault(require("../models/cart.models"));
// create
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const { product_id, quantity = 1 } = req.body;
    let cart = null;
    const product = await product_models_1.default.findOne({ _id: product_id });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    cart = await cart_models_1.default.findOne({ user: user_id });
    if (cart) {
        //*  if cart already created for user
        const product_exists = cart.items.find((item) => item.product.toString() === product._id.toString());
        if (product_exists) {
            product_exists.quantity = Number(quantity);
        }
        else {
            cart.items.push({
                product: product._id,
                quantity: Number(quantity),
            });
        }
    }
    else {
        //* if cart not exists for user
        cart = new cart_models_1.default({
            user: user_id,
            items: [{ product: product._id, quantity: Number(quantity) }],
        });
    }
    //* calculate total amount
    await cart.populate("items.product");
    cart.total_amount = cart.items.reduce((acc, item) => {
        return acc + (item.product.sale_price ?? item.product.price) * item.quantity;
    }, 0);
    //*   save cart
    await cart.save();
    res.status(201).json({
        message: "Product added to cart",
        data: cart,
        status: "success",
    });
});
//* get cart [user]
exports.getCart = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user = req.user?._id;
    const cart = await cart_models_1.default.findOne({
        user: user,
    })
        .populate("user")
        .populate("items.product");
    if (!cart) {
        // A user with no cart yet simply has an empty cart — not an error
        res.status(200).json({
            message: "Cart fetched",
            data: { user: user, items: [], total_amount: 0 },
            status: "success",
        });
        return;
    }
    //* calculate  total amount
    cart.total_amount = cart.items.reduce((acc, item) => {
        return acc + ((item.product?.sale_price ?? item.product?.price) || 0) * item.quantity;
    }, 0);
    await cart.save();
    res.status(200).json({
        message: "Cart fetched",
        data: cart,
        status: "success",
    });
});
//* remove product from cart
exports.remove = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user = req.user?._id;
    const { product } = req.body;
    const cart = await cart_models_1.default.findOne({ user: user });
    if (!cart) {
        // Nothing to remove — return an empty cart rather than failing
        res.status(200).json({
            message: "Cart fetched",
            data: { user: user, items: [], total_amount: 0 },
            status: "success",
        });
        return;
    }
    const items = cart.items.filter((item) => item.product?.toString() !== product.toString());
    cart.items = items;
    //* calculate total amount
    await cart.populate("items.product");
    cart.total_amount = cart.items.reduce((acc, item) => {
        return acc + ((item.product?.sale_price ?? item.product?.price) || 0) * item.quantity;
    }, 0);
    await cart.save();
    res.status(200).json({
        message: "Product removed from cart",
        data: cart,
        status: "success",
    });
});
//* clear all
exports.clear = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user = req.user?._id;
    await cart_models_1.default.findOneAndDelete({ user: user });
    res.status(200).json({
        message: "Cart cleared",
        data: null,
        status: "success",
    });
});
