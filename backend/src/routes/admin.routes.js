import express from "express";

import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";

import { updateOrderStatusSchema } from "../validators/admin.validator.js";

const router = express.Router();

// All admin APIs require admin access
router.use(authenticate, authorize("admin"));

// Get all customer orders
router.get("/orders", getAllOrders);

// Update order status
router.put("/orders/:id", validateBody(updateOrderStatusSchema), updateOrderStatus);

export default router;
