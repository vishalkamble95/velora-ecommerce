import {
  getAllOrders as getAllOrdersService,
  updateOrderStatus as updateOrderStatusService,
} from "../services/order.service.js";

// Get orders belonging to the logged-in admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersService(req.user._id);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status only for orders belonging to the admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.validatedBody;

    const order = await updateOrderStatusService(
      req.params.id,
      orderStatus,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};
