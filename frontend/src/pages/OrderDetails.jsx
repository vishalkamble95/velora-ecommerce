import { Link, useParams } from "react-router-dom";
import {
  Package,
  CalendarDays,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Receipt,
} from "lucide-react";

import { useOrder } from "../features/orders/useOrder";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import formatCurrency from "../utils/formatCurrency";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data?.order) {
    return (
      <div className="order-details-error">
        <ErrorMessage message="Order not found or failed to load." />

        <div className="order-error-actions">
          <button onClick={() => window.location.reload()}>Retry</button>

          <Link to="/orders" className="order-back-btn">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = data.order;
  const shipping = order.shippingAddress;

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <Link to="/orders" className="order-back-link">
          <ArrowLeft size={18} />
          Back to My Orders
        </Link>

        <div className="order-details-header">
          <div>
            <h2>Order Details</h2>
            <p>View your order information and purchase summary.</p>
          </div>

          <span
            className={`order-status status-${order.orderStatus.toLowerCase()}`}
          >
            {order.orderStatus.toUpperCase()}
          </span>
        </div>

        <div className="order-overview-card">
          <div className="order-overview-item">
            <Package size={21} />
            <div>
              <span>Order ID</span>
              <strong>{order._id}</strong>
            </div>
          </div>

          <div className="order-overview-item">
            <CalendarDays size={21} />
            <div>
              <span>Order Date</span>
              <strong>
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>

        <div className="order-details-layout">
          <div className="order-main-content">
            <section className="order-section">
              <div className="order-section-title">
                <ShoppingBag size={21} />
                <h3>Products ({order.items.length})</h3>
              </div>

              <div className="order-products-list">
                {order.items.map((item, index) => (
                  <div
                    className="order-product-item"
                    key={item.product || index}
                  >
                    <div className="order-product-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="order-product-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {formatCurrency(item.price)}</p>
                    </div>

                    <div className="order-product-subtotal">
                      <span>Subtotal</span>
                      <strong>
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="order-section">
              <div className="order-section-title">
                <MapPin size={21} />
                <h3>Shipping Address</h3>
              </div>

              <div className="shipping-address-content">
                <strong>{shipping.fullName}</strong>
                <p>{shipping.mobileNumber}</p>
                <p>{shipping.address}</p>
                <p>
                  {shipping.city}, {shipping.state}
                </p>
                <p>{shipping.pincode}</p>
              </div>
            </section>

            <section className="order-section">
              <div className="order-section-title">
                <CreditCard size={21} />
                <h3>Payment Details</h3>
              </div>

              <div className="payment-details-content">
                <div>
                  <span>Payment Method</span>
                  <strong>{order.paymentMethod}</strong>
                </div>

                <div>
                  <span>Payment Status</span>
                  <strong>{order.paymentStatus}</strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="order-summary-card">
            <div className="order-section-title">
              <Receipt size={21} />
              <h3>Price Summary</h3>
            </div>

            <div className="order-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(order.subtotal)}</strong>
            </div>

            <div className="order-summary-row">
              <span>Delivery Charge</span>
              <strong>{formatCurrency(order.deliveryCharge)}</strong>
            </div>

            <div className="order-summary-total">
              <span>Total Amount</span>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </div>

            <Link to="/orders" className="order-summary-back-btn">
              <ArrowLeft size={17} />
              Back to My Orders
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
