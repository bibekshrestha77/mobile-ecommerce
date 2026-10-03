"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
// All cart routes require authentication
router.use((0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN]));
// Add item to cart
router.post("/", cart_controller_1.create);
// Get user's cart
router.get("/", cart_controller_1.getCart);
// Remove item from cart
router.post("/remove", cart_controller_1.remove);
// Clear entire cart
router.post("/clear", cart_controller_1.clear);
exports.default = router;
