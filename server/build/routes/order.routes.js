"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
// All order routes require authentication
router.use((0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN]));
// Place an order from the user's cart
router.post("/", order_controller_1.create);
// Current user's orders
router.get("/", order_controller_1.getAll);
// Admin: list all orders / update status (must be before /:id)
router.get("/admin/all", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), order_controller_1.getAllForAdmin);
router.patch("/:id/status", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), order_controller_1.updateStatus);
// Order detail (owner or admin)
router.get("/:id", order_controller_1.getById);
exports.default = router;
