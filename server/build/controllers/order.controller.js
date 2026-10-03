"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllForAdmin = exports.updateStatus = exports.getById = exports.getAll = exports.create = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_models_1 = __importDefault(require("../models/cart.models"));
const product_models_1 = __importDefault(require("../models/product.models"));
const enum_types_1 = require("../@types/enum.types");
const validation_utils_1 = require("../utils/validation.utils");
const generateOrderNumber = () => {
    const date = new Date();
    const yyyymmdd = date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${yyyymmdd}-${rand}`;
};
/**
 * POST /api/orders
 * Body: { shipping_address, payment_method, card_number }
 * Creates an order from the user's cart (server-side pricing — the client
 * never sends prices), then clears the cart and decrements stock.
 */
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const { shipping_address, payment_method = "card", card_number } = req.body;
    (0, validation_utils_1.validateRequiredFields)(shipping_address || {}, [
        "first_name",
        "last_name",
        "email",
        "address",
        "city",
        "state",
        "zip_code",
        "country",
    ]);
    const cart = await cart_models_1.default.findOne({ user: user_id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        throw new error_handler_middleware_1.default("Your cart is empty", 400);
    }
    // Validate stock before committing
    for (const item of cart.items) {
        const product = item.product;
        if (!product) {
            throw new error_handler_middleware_1.default("A product in your cart no longer exists", 400);
        }
        if (product.stock < item.quantity) {
            throw new error_handler_middleware_1.default(`Only ${product.stock} left of "${product.name}"`, 400);
        }
    }
    // Snapshot items with server-side pricing (sale price wins)
    const items = cart.items.map((item) => {
        const product = item.product;
        const unit_price = product.sale_price ?? product.price;
        return {
            product: product._id,
            name: product.name,
            price: unit_price,
            quantity: item.quantity,
            image: product.cover_image,
        };
    });
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping_cost = subtotal >= 50 ? 0 : 5;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = Math.round((subtotal + shipping_cost + tax) * 100) / 100;
    // Decrement stock
    for (const item of cart.items) {
        await product_models_1.default.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
    const card_last4 = payment_method === "card" && typeof card_number === "string"
        ? card_number.replace(/\s+/g, "").slice(-4)
        : undefined;
    const order = await order_model_1.default.create({
        user: user_id,
        order_number: generateOrderNumber(),
        items,
        shipping_address,
        payment_method,
        card_last4,
        subtotal,
        shipping_cost,
        tax,
        total,
        status: enum_types_1.OrderStatus.PAID,
        is_paid: true,
        paid_at: new Date(),
    });
    // Order placed — empty the cart
    await cart_models_1.default.findOneAndDelete({ user: user_id });
    res.status(201).json({
        message: "Order placed successfully",
        status: "success",
        data: order,
    });
});
/** GET /api/orders — the current user's orders (newest first) */
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const user_id = req.user?._id;
    const orders = await order_model_1.default.find({ user: user_id }).sort({ createdAt: -1 });
    res.status(200).json({
        message: "Orders fetched",
        status: "success",
        data: orders,
    });
});
/** GET /api/orders/:id — order detail (owner or admin only) */
exports.getById = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user_id = req.user?._id;
    const role = req.user?.role;
    const order = await order_model_1.default.findOne({ _id: id });
    if (!order) {
        throw new error_handler_middleware_1.default("Order not found", 404);
    }
    if (String(order.user) !== String(user_id) && role !== "ADMIN") {
        throw new error_handler_middleware_1.default("Unauthorized. Access denied", 403);
    }
    res.status(200).json({
        message: "Order fetched",
        status: "success",
        data: order,
    });
});
/** PATCH /api/orders/:id/status — admin updates fulfilment status */
exports.updateStatus = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!Object.values(enum_types_1.OrderStatus).includes(status)) {
        throw new error_handler_middleware_1.default(`Invalid status. Expected one of: ${Object.values(enum_types_1.OrderStatus).join(", ")}`, 400);
    }
    const order = await order_model_1.default.findOneAndUpdate({ _id: id }, { status }, { new: true, runValidators: true });
    if (!order) {
        throw new error_handler_middleware_1.default("Order not found", 404);
    }
    res.status(200).json({
        message: "Order status updated",
        status: "success",
        data: order,
    });
});
/** GET /api/orders/admin/all — admin lists every order */
exports.getAllForAdmin = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status)
        filter.status = req.query.status;
    const [orders, total] = await Promise.all([
        order_model_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "first_name last_name email"),
        order_model_1.default.countDocuments(filter),
    ]);
    res.status(200).json({
        message: "Orders fetched",
        status: "success",
        data: orders,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});
