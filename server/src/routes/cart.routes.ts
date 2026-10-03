import express from "express";
import { create, getCart, remove, clear } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

const router = express.Router();

// All cart routes require authentication
router.use(authenticate([Role.USER, Role.ADMIN]));

// Add item to cart
router.post("/", create);

// Get user's cart
router.get("/", getCart);

// Remove item from cart
router.post("/remove", remove);

// Clear entire cart
router.post("/clear", clear);

export default router;