import {
  createProduct as createProductService,
  getAllProducts as getAllProductsService,
  getAdminProducts as getAdminProductsService,
  getProductById as getProductByIdService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  getProductCategories as getProductCategoriesService,
} from "../services/product.service.js";

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.validatedBody, req.user._id);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products (public listing)
export const getAllProducts = async (req, res, next) => {
  try {
    const result = await getAllProductsService(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in admin's products
export const getAdminProducts = async (req, res, next) => {
  try {
    const result = await getAdminProductsService(req.query, req.user._id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.validatedBody,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await deleteProductService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Get product categories
export const getProductCategories = async (req, res, next) => {
  try {
    const categories = await getProductCategoriesService();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
