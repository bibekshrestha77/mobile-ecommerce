import express from "express";
import {
  create,
  getAll,
  getById,
  getAllForAdmin,
  updateStatus,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

const router = express.Router();

// All order routes require authentication
router.use(authenticate([Role.USER, Role.ADMIN]));

// Place an order from the user's cart
router.post("/", create);

// Current user's orders
router.get("/", getAll);

// Admin: list all orders / update status (must be before /:id)
router.get("/admin/all", authenticate([Role.ADMIN]), getAllForAdmin);
router.patch("/:id/status", authenticate([Role.ADMIN]), updateStatus);

// Order detail (owner or admin)
router.get("/:id", getById);

export default router;
