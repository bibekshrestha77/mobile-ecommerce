"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
// All wishlist routes require authentication
router.use((0, auth_middleware_1.authenticate)([enum_types_1.Role.USER, enum_types_1.Role.ADMIN]));
// Toggle wishlist item (add/remove)
router.post("/", wishlist_controller_1.create);
// Get user's wishlist
router.get("/", wishlist_controller_1.getAll);
// Clear entire wishlist
router.post("/clear", wishlist_controller_1.clearAll);
exports.default = router;
