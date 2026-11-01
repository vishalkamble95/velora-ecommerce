import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  IndianRupee,
} from "lucide-react";

import api from "../services/api";
import { getAdminProducts } from "../services/productService";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import formatCurrency from "../utils/formatCurrency";

const AdminDashboard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const [ordersResponse, productsResponse] = await Promise.all([
        api.get("/admin/orders"),
        getAdminProducts(),
      ]);

      return {
        orders: ordersResponse.data.orders || [],
        totalProducts: productsResponse.totalProducts || 0,
      };
    },
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="admin-dashboard-error">
        <ErrorMessage message="Failed to load admin dashboard." />
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  const orders = data.orders;

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered",
  ).length;

  const totalRevenue = orders.reduce((total, order) => {
    if (order.orderStatus === "Cancelled") {
      return total;
    }

    return total + order.totalAmount;
  }, 0);

  const dashboardStats = [
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      className: "admin-stat-blue",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      className: "admin-stat-purple",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      className: "admin-stat-orange",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: CheckCircle,
      className: "admin-stat-green",
    },
    {
      title: "Order Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      className: "admin-stat-indigo",
    },
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div className="admin-dashboard-heading">
            <div className="admin-dashboard-title-icon">
              <LayoutDashboard size={25} />
            </div>

            <div>
              <h2>Admin Dashboard</h2>
              <p>Overview of your store's performance.</p>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-stats">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div className="admin-stat-card" key={stat.title}>
                <div className={`admin-stat-icon ${stat.className}`}>
                  <Icon size={25} />
                </div>

                <div className="admin-stat-info">
                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div className="admin-dashboard-note">
          <div className="admin-dashboard-note-icon">
            <LayoutDashboard size={21} />
          </div>

          <div>
            <h3>Store Overview</h3>
            <p>
              Monitor your products, orders, delivery progress, and revenue from
              one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
