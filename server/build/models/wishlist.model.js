"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// user , product -> id
// {user:'13' , product:'1' , }
// {user:'123' , product:'123' , } ,
// {user:'3' , product:'123' , } ,
// {user:'13' , product:'1' , }
const wishlistSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required']
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Product is required']
    }
}, { timestamps: true });
// model
const WishList = mongoose_1.default.model('wishlist', wishlistSchema);
exports.default = WishList;
