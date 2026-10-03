"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// user -> user id
// items -> [{product -> id , quantity:number },{product -> id , quantity:number }]
const cartSchema = new mongoose_1.default.Schema({
    // user
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"],
    },
    // items
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "product",
                required: [true, "product is required"],
            },
            quantity: {
                type: Number,
                required: [true, 'quantity is required'],
                min: [1, 'quantity cannot be less than 1']
            }
        },
    ],
    total_amount: Number
}, { timestamps: true });
const Cart = mongoose_1.default.model("cart", cartSchema);
exports.default = Cart;
