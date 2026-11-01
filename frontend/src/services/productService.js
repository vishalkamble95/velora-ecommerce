import api from "./api";

// Get all products
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

// Get admin's products
export const getAdminProducts = async (params = {}) => {
  const response = await api.get("/products/admin", {
    params,
  });

  return response.data;
};

// Get single product
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

// Create product
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);

  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);

  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};

// Get all product categories
export const getProductCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};
