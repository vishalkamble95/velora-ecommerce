import { createContext, useContext, useEffect, useState } from "react";

import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication when application starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getUserProfile();

        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (formData) => {
    const response = await loginUser(formData);

    setUser(response.user);

    return response;
  };

  // Register
  const register = async (formData) => {
    const response = await registerUser(formData);

    setUser(response.user);

    return response;
  };

  // Logout
  const logout = async () => {
    await logoutUser();

    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
