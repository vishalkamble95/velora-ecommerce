import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
  Store,
} from "lucide-react";

import { useCart } from "../features/cart/useCart";
import { useUpdateCart } from "../features/cart/useUpdateCart";
import { useRemoveFromCart } from "../features/cart/useRemoveFromCart";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ConfirmDialog from "../components/common/ConfirmDialog";

import formatCurrency from "../utils/formatCurrency";

const Cart = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useCart();

  const updateCartMutation = useUpdateCart();
  const removeCartMutation = useRemoveFromCart();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="cart-error-page">
        <ErrorMessage message="Failed to load cart." />
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const cartItems = (data?.cart?.items || []).filter((item) => item?.product);

  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const totalAmount = cartItems.reduce((total, item) => {
    const price = item?.product?.discountPrice || item?.product?.price;

    return total + price * item.quantity;
  }, 0);

  const handleQuantityChange = (productId, quantity) => {
    setError("");
    setSuccess("");

    updateCartMutation.mutate(
      { productId, quantity },
      {
        onSuccess: () => {
          setSuccess("Cart quantity updated successfully.");
        },
        onError: (error) => {
          setError(
            error.response?.data?.message || "Failed to update quantity.",
          );
        },
      },
    );
  };

  const handleRemove = () => {
    if (!selectedProduct) return;

    setError("");
    setSuccess("");

    removeCartMutation.mutate(selectedProduct, {
      onSuccess: () => {
        setSelectedProduct(null);
        setSuccess("Product removed from cart successfully.");
      },
      onError: (error) => {
        setError(error.response?.data?.message || "Failed to remove product.");
        setSelectedProduct(null);
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="cart-empty-icon">
            <ShoppingBag size={45} />
          </div>

          <h2>Your Cart is Empty</h2>
          <p>
            Looks like you haven't added anything to your cart yet. Explore our
            products and find something you love.
          </p>

          <Button onClick={() => navigate("/products")}>
            <ShoppingCart size={18} />
            Explore Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <div>
            <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
            <h2>My Cart</h2>
            <p>Review your items before proceeding to checkout.</p>
          </div>

          <div className="cart-item-count">
            <ShoppingBag size={19} />
            <span>{totalItems} Items</span>
          </div>
        </div>

        <ErrorMessage message={error} />

        {success && <p className="cart-success-message">{success}</p>}

        <div className="cart-layout">
          <div className="cart-products-section">
            <div className="cart-section-heading">
              <h3>Cart Items</h3>
              <span>{cartItems.length} Products</span>
            </div>

            <div className="cart-products-list">
              {cartItems.map((item) => {
                const product = item.product;
                const price = product.discountPrice || product.price;

                return (
                  <div className="cart-product-card" key={product._id}>
                    <div className="cart-product-image">
                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="cart-product-details">
                      <h3>{product.name}</h3>

                      <p className="cart-product-brand">
                        Brand: {product.brand}
                      </p>

                      <p className="cart-product-price">
                        {formatCurrency(price)}
                      </p>

                      <div className="cart-stock-info">
                        <Package size={15} />
                        <span>Available Stock: {product.stock}</span>
                      </div>

                      <div className="cart-product-controls">
                        <div className="cart-quantity-control">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                item.quantity - 1,
                              )
                            }
                            disabled={
                              item.quantity <= 1 || updateCartMutation.isPending
                            }
                          >
                            <Minus size={15} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                item.quantity + 1,
                              )
                            }
                            disabled={
                              item.quantity >= product.stock ||
                              updateCartMutation.isPending
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() => setSelectedProduct(product._id)}
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-product-subtotal">
                      <span>Subtotal</span>
                      <strong>{formatCurrency(price * item.quantity)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="cart-continue-link"
              onClick={() => navigate("/products")}
            >
              <ArrowRight size={17} />
              Continue Shopping
            </button>
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-heading">
              <h3>Order Summary</h3>
            </div>

            <div className="cart-summary-row">
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>

            <div className="cart-summary-total">
              <span>Total Amount</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>

            <div className="cart-summary-note">
              <Store size={17} />
              <span>
                Shipping and other charges, if applicable, are calculated at
                checkout.
              </span>
            </div>

            <Button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
              <ArrowRight size={18} />
            </Button>
          </aside>
        </div>
      </div>

      {selectedProduct && (
        <ConfirmDialog
          message="Are you sure you want to remove this product?"
          onConfirm={handleRemove}
          onCancel={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Cart;
