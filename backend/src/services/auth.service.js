import bcrypt from "bcrypt";

import User from "../models/user.model.js";

export const registerUser = async ({ name, email, password }) => {
  if (Buffer.byteLength(password, "utf8") > 72) {
    const error = new Error("Password must not exceed 72 bytes");

    error.statusCode = 400;

    throw error;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("An account with this email already exists");

    error.statusCode = 409;

    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error(
        "An account with this email already exists",
      );

      duplicateError.statusCode = 409;

      throw duplicateError;
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "_id name email role createdAt updatedAt",
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
