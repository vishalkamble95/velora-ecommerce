import express from "express";

import {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getProductById,
  getProductCategories,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

const router = express.Router();

// Get all products - Public
router.get("/", getAllProducts);

// Get all product categories - Public
router.get("/categories", getProductCategories);

// Get logged-in admin's products - Admin only
router.get("/admin", authenticate, authorize("admin"), getAdminProducts);

// Get product by ID - Public
router.get("/:id", getProductById);

// Create product - Admin only
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateBody(createProductSchema),
  createProduct,
);

// Update product - Admin only
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateBody(updateProductSchema),
  updateProduct,
);

// Delete product - Admin only
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default router;
