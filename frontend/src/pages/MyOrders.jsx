import { Link } from "react-router-dom";
import {
  Package,
  CalendarDays,
  CreditCard,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useMyOrders } from "../features/orders/useMyOrders";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import formatCurrency from "../utils/formatCurrency";

const MyOrders = () => {
  const { data, isLoading, isError } = useMyOrders();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="my-orders-error">
        <ErrorMessage message="Failed to load your orders." />
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="orders-empty">
          <div className="orders-empty-icon">
            <ShoppingBag size={42} />
          </div>

          <h2>No Orders Yet</h2>
          <p>
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>

          <Link to="/products" className="orders-shop-btn">
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-header">
          <div>
            <h2>My Orders</h2>
            <p>Track and manage your recent purchases.</p>
          </div>

          <div className="orders-count">
            <Package size={19} />
            <span>Total Orders: {orders.length}</span>
          </div>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <div className="order-id-section">
                  <span className="order-label">ORDER ID</span>
                  <h3>{order._id}</h3>
                </div>

                <span
                  className={`order-status status-${order.orderStatus.toLowerCase()}`}
                >
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>

              <div className="order-card-details">
                <div className="order-detail-item">
                  <CalendarDays size={19} />
                  <div>
                    <span>Order Date</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="order-detail-item">
                  <ShoppingBag size={19} />
                  <div>
                    <span>Total Products</span>
                    <strong>{order.items.length}</strong>
                  </div>
                </div>

                <div className="order-detail-item">
                  <CreditCard size={19} />
                  <div>
                    <span>Payment Method</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>
                </div>

                <div className="order-detail-item order-total">
                  <div>
                    <span>Total Amount</span>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <Link to={`/orders/${order._id}`} className="order-details-btn">
                  View Order Details <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
