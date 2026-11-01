import api from "./api";

// Create order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

// Get all orders of logged-in user
export const getMyOrders = async () => {
  const response = await api.get("/orders");

  return response.data;
};

// Get single order details
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};
