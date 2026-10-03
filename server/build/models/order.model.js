"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../@types/enum.types");
//* Snapshot-based order: items are copied at purchase time so later
//* product edits/deletes never corrupt historical orders.
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"],
    },
    order_number: {
        type: String,
        required: true,
        unique: true,
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
            name: { type: String, required: true },
            price: { type: Number, required: true }, // unit price actually paid
            quantity: {
                type: Number,
                required: true,
                min: [1, "quantity cannot be less than 1"],
            },
            image: {
                path: String,
                public_id: String,
            },
        },
    ],
    shipping_address: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip_code: { type: String, required: true },
        country: { type: String, required: true },
    },
    payment_method: {
        type: String,
        enum: ["card", "cod"],
        default: "card",
    },
    // Only the last 4 digits are stored — never the full card number
    card_last4: { type: String },
    subtotal: { type: Number, required: true, min: 0 },
    shipping_cost: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: Object.values(enum_types_1.OrderStatus),
        default: enum_types_1.OrderStatus.PENDING,
    },
    is_paid: { type: Boolean, default: false },
    paid_at: { type: Date },
}, { timestamps: true });
const Order = mongoose_1.default.model("order", orderSchema);
exports.default = Order;
