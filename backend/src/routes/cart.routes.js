import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cart.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

import {
  addToCartSchema,
  updateCartSchema,
} from "../validators/cart.validator.js";

const router = express.Router();

// All cart APIs require authentication
router.use(authenticate, authorize("user"));

// Get user's cart
router.get("/", getCart);

// Add product to cart
router.post("/", validateBody(addToCartSchema), addToCart);

// Update product quantity
router.put("/:productId", validateBody(updateCartSchema), updateCartItem);

// Remove product from cart
router.delete("/:productId", removeFromCart);

export default router;
