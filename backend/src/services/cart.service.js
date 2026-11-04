import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Get user's cart

// Get user's cart and remove invalid products
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  await cart.populate("items.product");

  // Remove cart items whose products no longer exist
  const validItems = cart.items.filter((item) => item.product);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  return cart.toObject();
};

// Add product to cart
export const addToCart = async (userId, productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock === 0) {
    const error = new Error("Product is out of stock");
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (newQuantity > product.stock) {
    const error = new Error("Requested quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return getCart(userId);
};

// Update product quantity
export const updateCartItem = async (userId, productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error = new Error("Requested quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (!existingItem) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  existingItem.quantity = quantity;

  await cart.save();

  return getCart(userId);
};

// Remove product from cart
export const removeFromCart = async (userId, productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId,
  );

  if (!itemExists) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  return getCart(userId);
};
