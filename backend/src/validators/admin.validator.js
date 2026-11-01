import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]),
});
