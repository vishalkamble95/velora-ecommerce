import { z } from "zod";

// Add product to cart
export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),

  quantity: z.number().int().min(1).default(1),
});

// Update cart quantity
export const updateCartSchema = z.object({
  quantity: z.number().int().min(1),
});
