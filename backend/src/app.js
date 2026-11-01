import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { authenticate } from "./middleware/auth.middleware.js";
import { authorize } from "./middleware/authorize.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/auth/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: req.user,
  });
});

// Only authenticated users can access
app.get("/api/test/user", authenticate, authorize("user"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "User access granted",
    user: req.user,
  });
});

// Only admins can access
app.get("/api/test/admin", authenticate, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
