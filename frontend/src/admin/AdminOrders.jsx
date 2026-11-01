import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  User,
  Mail,
  Calendar,
  CreditCard,
  IndianRupee,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";
import formatCurrency from "../utils/formatCurrency";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await api.get("/admin/orders");
      return response.data.orders || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, orderStatus }) => {
      const response = await api.put(`/admin/orders/${orderId}`, {
        orderStatus,
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminOrders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminDashboard"],
      });

      setError("");
      setSuccessMessage("Order status updated successfully.");
    },

    onError: (error) => {
      setSuccessMessage("");
      setError(
        error.response?.data?.message || "Failed to update order status.",
      );
    },
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="admin-orders-error">
        <ErrorMessage message="Failed to load orders." />
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const orders = data || [];

  const handleStatusChange = (orderId, status) => {
    setSelectedStatuses((previous) => ({
      ...previous,
      [orderId]: status,
    }));
  };

  const handleUpdateStatus = (order) => {
    const newStatus = selectedStatuses[order._id];

    if (!newStatus || newStatus === order.orderStatus) {
      return;
    }

    setError("");
    setSuccessMessage("");

    updateStatusMutation.mutate({
      orderId: order._id,
      orderStatus: newStatus,
    });
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <div>
          <span className="admin-orders-eyebrow">ADMINISTRATION</span>
          <h2>Manage Orders</h2>
          <p>View customer orders and manage their delivery status.</p>
        </div>

        <div className="admin-orders-count">
          <Package size={20} />
          <span>{orders.length} Orders</span>
        </div>
      </div>

      <div className="admin-orders-messages">
        <ErrorMessage message={error} />

        {successMessage && (
          <p className="admin-orders-success">{successMessage}</p>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="admin-orders-empty">
          <div className="admin-orders-empty-icon">
            <ShoppingBag size={32} />
          </div>
          <h3>No Orders Available</h3>
          <p>Customer orders will appear here when they are placed.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order._id}>
              <div className="admin-order-top">
                <div className="admin-order-title">
                  <div className="admin-order-icon">
                    <Package size={22} />
                  </div>

                  <div>
                    <h3>Order Details</h3>
                    <p className="admin-order-id">ID: {order._id}</p>
                  </div>
                </div>

                <span
                  className={`admin-order-status status-${order.orderStatus?.toLowerCase()}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="admin-order-info-grid">
                <div className="admin-order-info-item">
                  <User size={17} />
                  <div>
                    <span>Customer</span>
                    <strong>{order.user?.name}</strong>
                  </div>
                </div>

                <div className="admin-order-info-item">
                  <Mail size={17} />
                  <div>
                    <span>Email</span>
                    <strong>{order.user?.email}</strong>
                  </div>
                </div>

                <div className="admin-order-info-item">
                  <Calendar size={17} />
                  <div>
                    <span>Order Date</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="admin-order-info-item">
                  <IndianRupee size={17} />
                  <div>
                    <span>Total Amount</span>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                </div>

                <div className="admin-order-info-item">
                  <CreditCard size={17} />
                  <div>
                    <span>Payment Method</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>
                </div>

                <div className="admin-order-info-item">
                  <CreditCard size={17} />
                  <div>
                    <span>Payment Status</span>
                    <strong>{order.paymentStatus}</strong>
                  </div>
                </div>
              </div>

              <div className="admin-order-products">
                <h4>
                  <ShoppingBag size={18} />
                  Ordered Products
                </h4>

                <div className="admin-order-product-list">
                  {order.items.map((item, index) => (
                    <div
                      className="admin-order-product"
                      key={item.product || index}
                    >
                      <span>{item.name}</span>
                      <span className="admin-order-quantity">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-order-update">
                <div className="admin-order-update-field">
                  <label htmlFor={`status-${order._id}`}>
                    Update Order Status
                  </label>

                  <select
                    id={`status-${order._id}`}
                    value={selectedStatuses[order._id] || order.orderStatus}
                    onChange={(event) =>
                      handleStatusChange(order._id, event.target.value)
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => handleUpdateStatus(order)}
                  disabled={
                    updateStatusMutation.isPending ||
                    !selectedStatuses[order._id] ||
                    selectedStatuses[order._id] === order.orderStatus
                  }
                >
                  <RefreshCw size={16} />
                  Update Status
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
