import { z } from "zod";

const productFields = {
  name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Product description is required")
    .max(2000, "Description cannot exceed 2000 characters"),

  price: z.number().min(0, "Price cannot be negative"),

  discountPrice: z
    .number()
    .min(0, "Discount price cannot be negative")
    .nullable()
    .optional(),

  category: z.string().trim().min(1, "Category is required"),

  brand: z
    .string()
    .trim()
    .min(1, "Brand is required")
    .max(100, "Brand cannot exceed 100 characters"),

  image: z.string().trim().url("Please provide a valid image URL"),

  rating: z
    .number()
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot exceed 5")
    .optional(),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
};

// Validate discount price against original price
const validateDiscountPrice = (data, ctx) => {
  if (
    typeof data.price === "number" &&
    typeof data.discountPrice === "number" &&
    data.discountPrice > data.price
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["discountPrice"],
      message: "Discount price cannot exceed product price",
    });
  }
};

// Product creation validation
export const createProductSchema = z
  .object(productFields)
  .superRefine(validateDiscountPrice);

// Product update validation
export const updateProductSchema = z
  .object(productFields)
  .partial()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one field is required for update",
      });
    }

    validateDiscountPrice(data, ctx);
  });
