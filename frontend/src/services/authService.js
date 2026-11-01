import api from "./api";

// Register user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

// Get logged-in user profile
export const getUserProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};
