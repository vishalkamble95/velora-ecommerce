import {
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
} from "../services/cart.service.js";

// Get user's cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartService(req.user.id);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// Add product to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.validatedBody;

    const cart = await addToCartService(req.user.id, productId, quantity);

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.validatedBody;

    const cart = await updateCartItemService(
      req.user.id,
      req.params.productId,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// Remove product from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await removeFromCartService(req.user.id, req.params.productId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
