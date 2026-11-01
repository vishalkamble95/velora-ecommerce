import { z } from "zod";

export const createOrderSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters")
    .max(100),

  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  address: z
    .string()
    .trim()
    .min(5, "Address must contain at least 5 characters")
    .max(300),

  city: z.string().trim().min(2, "City is required"),

  state: z.string().trim().min(2, "State is required"),

  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});
