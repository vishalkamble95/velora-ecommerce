import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  ShoppingBag,
  Package,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import { useCart } from "../features/cart/useCart";
import { useCreateOrder } from "../features/orders/useCreateOrder";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ConfirmDialog from "../components/common/ConfirmDialog";

import formatCurrency from "../utils/formatCurrency";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),
  address: z.string().trim().min(5, "Enter your address"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

const Checkout = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useCart();
  const createOrderMutation = useCreateOrder();

  const [orderError, setOrderError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="checkout-error-page">
        <ErrorMessage message="Failed to load cart." />
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const cartItems = (data?.cart?.items || []).filter((item) => item?.product);

  const totalAmount = cartItems.reduce((total, item) => {
    const product = item.product;

    if (!product) {
      return total;
    }

    const price = product.discountPrice || product.price;

    return total + price * item.quantity;
  }, 0);

  const onSubmit = (formData) => {
    setCheckoutData(formData);
    setShowConfirmation(true);
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;

    setOrderError("");
    setShowConfirmation(false);

    try {
      const response = await createOrderMutation.mutateAsync(checkoutData);

      navigate(`/orders/${response.order._id}`);
    } catch (error) {
      setOrderError(error.response?.data?.message || "Failed to place order.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty-state">
          <div className="checkout-empty-icon">
            <ShoppingBag size={42} />
          </div>

          <h2>Your Cart is Empty</h2>
          <p>Add products to your cart before proceeding to checkout.</p>

          <Button onClick={() => navigate("/products")}>
            Explore Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-heading">
          <span className="checkout-eyebrow">ALMOST THERE!</span>
          <h2>Checkout</h2>
          <p>Enter your shipping details and review your order.</p>
        </div>

        <ErrorMessage message={orderError} />

        <div className="checkout-layout">
          <section className="checkout-form-card">
            <div className="checkout-section-heading">
              <div className="checkout-heading-icon">
                <MapPin size={21} />
              </div>

              <div>
                <h3>Shipping Details</h3>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                register={register}
                error={errors.fullName?.message}
              />

              <Input
                label="Mobile Number"
                name="mobileNumber"
                placeholder="10-digit mobile number"
                register={register}
                error={errors.mobileNumber?.message}
              />

              <Input
                label="Address"
                name="address"
                placeholder="Enter your complete address"
                register={register}
                error={errors.address?.message}
              />

              <div className="checkout-location-grid">
                <Input
                  label="City"
                  name="city"
                  placeholder="Enter your city"
                  register={register}
                  error={errors.city?.message}
                />

                <Input
                  label="State"
                  name="state"
                  placeholder="Enter your state"
                  register={register}
                  error={errors.state?.message}
                />
              </div>

              <div className="checkout-pincode-field">
                <Input
                  label="Pincode"
                  name="pincode"
                  placeholder="6-digit pincode"
                  register={register}
                  error={errors.pincode?.message}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || createOrderMutation.isPending}
              >
                <ShoppingBag size={18} />
                {isSubmitting || createOrderMutation.isPending
                  ? "Placing Order..."
                  : "Place Order"}
              </Button>
            </form>

            <div className="checkout-security-note">
              <ShieldCheck size={18} />
              <span>Your shipping information is handled securely.</span>
            </div>
          </section>

          <aside className="checkout-summary-card">
            <div className="checkout-summary-heading">
              <div className="checkout-heading-icon">
                <Package size={21} />
              </div>

              <div>
                <h3>Order Summary</h3>
                <p>{cartItems.length} products in your cart</p>
              </div>
            </div>

            <div className="checkout-summary-products">
              {cartItems.map((item) => {
                const product = item.product;
                const price = product.discountPrice || product.price;

                return (
                  <div className="checkout-summary-product" key={product._id}>
                    <div className="checkout-product-image">
                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="checkout-product-info">
                      <h4>{product.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    <strong>{formatCurrency(price * item.quantity)}</strong>
                  </div>
                );
              })}
            </div>

            <div className="checkout-total-section">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>

              <div className="checkout-total-row">
                <span>Shipping</span>
                <strong>Calculated at checkout</strong>
              </div>

              <div className="checkout-grand-total">
                <span>Total Amount</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
            </div>

            <div className="checkout-payment-note">
              <CreditCard size={18} />
              <span>
                Payment details are handled according to your order's payment
                configuration.
              </span>
            </div>
          </aside>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmDialog
          message="Are you sure you want to place this order?"
          onConfirm={handlePlaceOrder}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
