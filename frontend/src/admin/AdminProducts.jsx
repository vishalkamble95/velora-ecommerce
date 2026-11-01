import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Boxes,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import ProductCard from "../components/products/ProductCard";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ConfirmDialog from "../components/common/ConfirmDialog";

const PRODUCTS_PER_PAGE = 12;

const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(1).max(2000),
  price: z.coerce.number().min(0),
  discountPrice: z.preprocess(
    (value) => (value === "" || value === undefined ? null : Number(value)),
    z.number().min(0).nullable(),
  ),
  category: z.string().trim().min(1),
  brand: z.string().trim().min(1).max(100),
  image: z.string().trim().url(),
  rating: z.coerce.number().min(0).max(5),
  stock: z.coerce.number().int().min(0),
});

const defaultValues = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  brand: "",
  image: "",
  rating: 0,
  stock: 0,
};

const AdminProducts = () => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", "admin", currentPage],
    queryFn: () =>
      getAdminProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
      }),
  });

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPages = data?.totalPages || 0;

  // Move to the previous page if the current page becomes invalid.
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      setCurrentPage(1);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset(defaultValues);
      setIsFormModalOpen(false);
      setSuccessMessage("Product created successfully.");
      setFormError("");
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message || "Failed to create product.",
      );
      setSuccessMessage("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, productData }) => updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSuccessMessage("Product updated successfully.");
      setEditingProduct(null);
      setIsFormModalOpen(false);
      reset(defaultValues);
      setFormError("");
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message || "Failed to update product.",
      );
      setSuccessMessage("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSuccessMessage("Product deleted successfully.");
      setDeletingProduct(null);
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message || "Failed to delete product.",
      );
      setSuccessMessage("");
    },
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormError("");
    setSuccessMessage("");
    reset(defaultValues);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormError("");
    setSuccessMessage("");

    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice ?? "",
      category: product.category,
      brand: product.brand,
      image: product.image,
      rating: product.rating ?? 0,
      stock: product.stock,
    });

    setIsFormModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setIsFormModalOpen(false);
    setFormError("");
    reset(defaultValues);
  };

  const onSubmit = (formData) => {
    setFormError("");
    setSuccessMessage("");

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct._id,
        productData: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct._id);
    }
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="admin-products-error">
        <ErrorMessage message="Failed to load products." />
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const startProduct =
    totalProducts === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endProduct = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  return (
    <div className="admin-products-page">
      <div className="admin-products-container">
        {/* Page Header */}
        <div className="admin-products-header">
          <div className="admin-products-heading">
            <div className="admin-products-title-icon">
              <Package size={25} />
            </div>

            <div>
              <h2>Manage Products</h2>
              <p>Add, update, and manage your store products.</p>
            </div>
          </div>

          <div className="admin-products-count">
            <Boxes size={19} />
            <span>{totalProducts} Products</span>
          </div>
        </div>

        {successMessage && (
          <div className="admin-products-success">{successMessage}</div>
        )}

        {/* Add Product Button */}
        <div className="admin-products-toolbar">
          <div>
            <h3>All Products</h3>
            <p>Manage your existing store inventory.</p>
          </div>

          <Button onClick={handleOpenAddModal}>
            <Plus size={18} />
            Add New Product
          </Button>
        </div>

        {/* Products List */}
        <section className="admin-products-list-section">
          {products.length === 0 ? (
            <div className="admin-products-empty">
              <Package size={40} />
              <h3>No Products Available</h3>
              <p>Click Add New Product to add your first product.</p>
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map((product) => (
                <div className="admin-product-item" key={product._id}>
                  <ProductCard product={product} />

                  <div className="admin-product-actions">
                    <Button onClick={() => handleEdit(product)}>
                      <Pencil size={16} />
                      Edit
                    </Button>

                    <Button onClick={() => setDeletingProduct(product)}>
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-products-pagination">
            <p>
              Showing{" "}
              <strong>
                {startProduct}-{endProduct}
              </strong>{" "}
              of <strong>{totalProducts}</strong> products
            </p>

            <div className="admin-products-pagination-controls">
              <button
                type="button"
                className="admin-products-page-arrow"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    className={`admin-products-page-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                className="admin-products-page-arrow"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {isFormModalOpen && (
          <div
            className="admin-product-modal-overlay"
            onClick={handleCancelEdit}
          >
            <div
              className="admin-product-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-product-modal-header">
                <div>
                  <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

                  <p>
                    {editingProduct
                      ? "Update the product information below."
                      : "Enter the details to add a new product."}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-product-modal-close"
                  onClick={handleCancelEdit}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              <form
                className="admin-product-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="admin-product-form-grid">
                  <Input
                    label="Product Name"
                    name="name"
                    register={register}
                    error={errors.name?.message}
                  />

                  <Input
                    label="Category"
                    name="category"
                    register={register}
                    error={errors.category?.message}
                  />

                  <Input
                    label="Brand"
                    name="brand"
                    register={register}
                    error={errors.brand?.message}
                  />

                  <Input
                    label="Price"
                    name="price"
                    type="number"
                    step="any"
                    min="0"
                    register={register}
                    error={errors.price?.message}
                  />

                  <Input
                    label="Discount Price"
                    name="discountPrice"
                    type="number"
                    step="any"
                    min="0"
                    register={register}
                    error={errors.discountPrice?.message}
                  />

                  <Input
                    label="Rating"
                    name="rating"
                    type="number"
                    step="any"
                    min="0"
                    max="5"
                    register={register}
                    error={errors.rating?.message}
                  />

                  <Input
                    label="Stock"
                    name="stock"
                    type="number"
                    step="1"
                    min="0"
                    register={register}
                    error={errors.stock?.message}
                  />

                  <Input
                    label="Image URL"
                    name="image"
                    register={register}
                    error={errors.image?.message}
                  />

                  <div className="admin-product-description">
                    <Input
                      label="Description"
                      name="description"
                      register={register}
                      error={errors.description?.message}
                    />
                  </div>
                </div>

                <ErrorMessage message={formError} />

                <div className="admin-product-form-actions">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
                    <Plus size={17} />
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                  </Button>

                  <Button type="button" onClick={handleCancelEdit}>
                    <X size={17} />
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deletingProduct && (
          <ConfirmDialog
            message={`Are you sure you want to delete ${deletingProduct.name}?`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
