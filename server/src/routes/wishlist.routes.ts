import express from "express";
import { create, getAll, clearAll } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticate([Role.USER, Role.ADMIN]));

// Toggle wishlist item (add/remove)
router.post("/", create);

// Get user's wishlist
router.get("/", getAll);

// Clear entire wishlist
router.post("/clear", clearAll);

export default router;