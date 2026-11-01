import mongoose from "mongoose";

import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Create order - Checkout
export const createOrder = async (userId, shippingAddress) => {
  const session = await mongoose.startSession();

  let createdOrder;

  try {
    await session.withTransaction(async () => {
      // Find user's cart
      const cart = await Cart.findOne({ user: userId })
        .populate("items.product")
        .session(session);

      if (!cart || cart.items.length === 0) {
        const error = new Error("Your cart is empty");
        error.statusCode = 400;
        throw error;
      }

      const orderItems = [];
      let subtotal = 0;

      // Validate products and calculate subtotal
      for (const item of cart.items) {
        const product = item.product;

        if (!product) {
          console.log("INVALID CART ITEM:", item);
          const error = new Error("A product in your cart no longer exists");
          error.statusCode = 400;
          throw error;
        }

        if (product.stock < item.quantity) {
          const error = new Error(`${product.name} does not have enough stock`);
          error.statusCode = 400;
          throw error;
        }

        const price =
          product.discountPrice !== null && product.discountPrice !== undefined
            ? product.discountPrice
            : product.price;

        subtotal += price * item.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price,
        });
      }

      // Reduce product stock
      for (const item of cart.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            new: true,
            session,
          },
        );

        if (!updatedProduct) {
          const error = new Error(
            "Product stock changed. Please review your cart.",
          );
          error.statusCode = 400;
          throw error;
        }
      }

      // Calculate delivery charge
      const deliveryCharge = subtotal >= 1000 ? 0 : 50;

      const totalAmount = subtotal + deliveryCharge;

      // Create order
      const orders = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            shippingAddress,
            subtotal,
            deliveryCharge,
            totalAmount,
            paymentMethod: "COD",
          },
        ],
        { session },
      );

      createdOrder = orders[0];

      // Clear user's cart
      cart.items = [];
      await cart.save({ session });
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
};

// Get logged-in user's orders
export const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

// Get single order details
export const getOrderById = async (userId, orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    const error = new Error("Invalid order ID");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).lean();

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

// Get orders containing products created by the logged-in admin
export const getAllOrders = async (adminId) => {
  const adminProductIds = await Product.distinct("_id", {
    createdBy: adminId,
  });

  if (adminProductIds.length === 0) {
    return [];
  }

  const orders = await Order.find({
    "items.product": { $in: adminProductIds },
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

// Update order status - Admin
export const updateOrderStatus = async (orderId, orderStatus, adminId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    const error = new Error("Invalid order ID");
    error.statusCode = 400;
    throw error;
  }

  const adminProductIds = await Product.distinct("_id", {
    createdBy: adminId,
  });

  const order = await Order.findOne({
    _id: orderId,
    "items.product": { $in: adminProductIds },
  });

  if (!order) {
    const error = new Error(
      "Order not found or you do not have permission to update it",
    );
    error.statusCode = 404;
    throw error;
  }

  order.orderStatus = orderStatus;

  await order.save();

  return order;
};
