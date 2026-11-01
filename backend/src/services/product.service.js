import mongoose from "mongoose";

import Product from "../models/product.model.js";

// Create product
export const createProduct = async (productData, adminId) => {
  const product = await Product.create({
    ...productData,
    createdBy: adminId,
  });

  return product;
};

// Get all products with pagination, search, filter and sorting
export const getAllProducts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  const skip = (page - 1) * limit;

  const filter = {};

  // Search by product name
  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i",
    };
  }

  // Filter by category
  if (query.category) {
    filter.category = query.category;
  }

  // Filter by minimum price
  if (query.minPrice || query.minPrice === "0") {
    filter.price = {
      ...filter.price,
      $gte: Number(query.minPrice),
    };
  }

  // Filter by maximum price
  if (query.maxPrice) {
    filter.price = {
      ...filter.price,
      $lte: Number(query.maxPrice),
    };
  }

  // Sorting
  let sort = { createdAt: -1 };

  if (query.sortBy === "priceLowToHigh") {
    sort = { price: 1 };
  } else if (query.sortBy === "priceHighToLow") {
    sort = { price: -1 };
  } else if (query.sortBy === "rating") {
    sort = { rating: -1 };
  }

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalProducts,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
  };
};

// Get logged-in admin's products
export const getAdminProducts = async (query, adminId) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  const skip = (page - 1) * limit;

  const filter = {
    createdBy: adminId,
  };

  // Search by product name
  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i",
    };
  }

  // Filter by category
  if (query.category) {
    filter.category = query.category;
  }

  // Filter by minimum price
  if (query.minPrice || query.minPrice === "0") {
    filter.price = {
      ...filter.price,
      $gte: Number(query.minPrice),
    };
  }

  // Filter by maximum price
  if (query.maxPrice) {
    filter.price = {
      ...filter.price,
      $lte: Number(query.maxPrice),
    };
  }

  // Sorting
  let sort = { createdAt: -1 };

  if (query.sortBy === "priceLowToHigh") {
    sort = { price: 1 };
  } else if (query.sortBy === "priceHighToLow") {
    sort = { price: -1 };
  } else if (query.sortBy === "rating") {
    sort = { rating: -1 };
  }

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalProducts,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
  };
};

// Get product by ID
export const getProductById = async (productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId).lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// Update product
export const updateProduct = async (productId, updateData, adminId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    createdBy: adminId,
  });

  if (!product) {
    const error = new Error("Product not found or you do not have permission");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(product, updateData);

  await product.save();

  return product;
};

// Delete product
export const deleteProduct = async (productId, adminId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOneAndDelete({
    _id: productId,
    createdBy: adminId,
  });

  if (!product) {
    const error = new Error("Product not found or you do not have permission");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// Get all unique product categories
export const getProductCategories = async () => {
  const categories = await Product.distinct("category");

  return categories;
};
