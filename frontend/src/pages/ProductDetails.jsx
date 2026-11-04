import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Zap,
  Star,
  Package,
  Tag,
  ShieldCheck,
} from "lucide-react";

import { useProduct } from "../features/products/useProducts";
import { useAddToCart } from "../features/cart/useAddToCart";
import { useAuth } from "../context/AuthContext";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import formatCurrency from "../utils/formatCurrency";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState("1");
  const [cartError, setCartError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");

  const { data, isLoading, isError, error, refetch } = useProduct(id);

  const addToCartMutation = useAddToCart();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data?.product) {
    const isNotFound = error?.response?.status === 404 || !data?.product;

    return (
      <div className="product-details-error">
        <ErrorMessage
          message={
            isNotFound
              ? "Product not found. It may have been removed."
              : "Failed to load product. Please try again."
          }
        />

        <div className="product-details-actions">
          <Button onClick={() => navigate("/products")}>
            Back to Products
          </Button>

          {!isNotFound && <Button onClick={() => refetch()}>Retry</Button>}
        </div>
      </div>
    );
  }

  const product = data.product;

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setQuantity("");
      return;
    }

    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue < 0) {
      return;
    }

    if (numberValue > product.stock) {
      setQuantity(String(product.stock));
      return;
    }

    setQuantity(value);
    setCartError("");
  };

  const handleQuantityBlur = () => {
    const numberValue = Number(quantity);

    if (quantity === "" || !Number.isInteger(numberValue) || numberValue < 1) {
      setQuantity("1");
    } else if (numberValue > product.stock) {
      setQuantity(String(product.stock));
    }
  };

  const getValidQuantity = () => {
    const numberValue = Number(quantity);

    if (
      quantity === "" ||
      !Number.isInteger(numberValue) ||
      numberValue < 1 ||
      numberValue > product.stock
    ) {
      setCartError("Please select a valid quantity.");
      return null;
    }

    return numberValue;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const selectedQuantity = getValidQuantity();

    if (selectedQuantity === null) {
      return;
    }

    setCartError("");
    setCartSuccess("");

    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity: selectedQuantity,
      },
      {
        onSuccess: () => {
          setCartSuccess("Product added to cart successfully.");
        },

        onError: (error) => {
          setCartError(
            error.response?.data?.message || "Failed to add product to cart.",
          );
        },
      },
    );
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const selectedQuantity = getValidQuantity();

    if (selectedQuantity === null) {
      return;
    }

    try {
      setCartError("");
      setCartSuccess("");

      await addToCartMutation.mutateAsync({
        productId: product._id,
        quantity: selectedQuantity,
      });

      navigate("/cart");
    } catch (error) {
      setCartError(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-details-heading">
          <span className="product-details-eyebrow">PRODUCT INFORMATION</span>
          <h2>Product Details</h2>
          <p>
            Explore product information and add your favourite item to cart.
          </p>
        </div>

        <div className="product-details-card">
          <div className="product-details-image-section">
            {product.discountPrice && (
              <span className="product-discount-badge">
                {discountPercentage}% OFF
              </span>
            )}

            <div className="product-details-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
              />
            </div>
          </div>

          <div className="product-details-info">
            <div className="product-details-category">
              <Tag size={15} />
              <span>{product.category}</span>
            </div>

            <h1 className="product-details-name">{product.name}</h1>

            <div className="product-details-rating">
              <Star size={17} fill="currentColor" />
              <span>{product.rating} / 5</span>
            </div>

            <p className="product-details-description">{product.description}</p>

            <div className="product-details-meta">
              <div>
                <span className="product-meta-label">Brand</span>
                <strong>{product.brand}</strong>
              </div>

              <div>
                <span className="product-meta-label">Category</span>
                <strong>{product.category}</strong>
              </div>
            </div>

            <div className="product-details-price-section">
              {product.discountPrice ? (
                <>
                  <span className="product-details-current-price">
                    {formatCurrency(product.discountPrice)}
                  </span>

                  <span className="product-details-original-price">
                    {formatCurrency(product.price)}
                  </span>

                  <span className="product-details-savings">
                    Save {discountPercentage}%
                  </span>
                </>
              ) : (
                <span className="product-details-current-price">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <div
              className={`product-stock-status ${
                product.stock > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              <Package size={17} />
              <span>
                {product.stock > 0
                  ? `Available Stock: ${product.stock}`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="product-purchase-section">
                <div className="product-quantity-control">
                  <label htmlFor="product-quantity">Quantity</label>

                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    step="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                  />
                </div>

                <div className="product-details-actions">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingCart size={18} />
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    disabled={addToCartMutation.isPending}
                  >
                    <Zap size={18} />
                    Buy Now
                  </Button>
                </div>

                {cartSuccess && (
                  <p className="product-cart-success">{cartSuccess}</p>
                )}
              </div>
            )}

            <ErrorMessage message={cartError} />

            <div className="product-details-assurance">
              <ShieldCheck size={19} />
              <span>Secure shopping experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
