import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createOrderSchema } from "../validators/order.validator.js";

const router = express.Router();

// All order APIs require login
router.use(authenticate);

// Checkout
router.post("/", validateBody(createOrderSchema), createOrder);

// My Orders
router.get("/", getMyOrders);

// Order Details
router.get("/:id", getOrderById);

export default router;
