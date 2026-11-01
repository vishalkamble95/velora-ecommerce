import {
  createOrder as createOrderService,
  getMyOrders as getMyOrdersService,
  getOrderById as getOrderByIdService,
} from "../services/order.service.js";

// Create order - Checkout
export const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(req.user.id, req.validatedBody);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await getMyOrdersService(req.user.id);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
export const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrderByIdService(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
