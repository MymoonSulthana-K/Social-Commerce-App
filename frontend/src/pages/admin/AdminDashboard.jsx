import { useEffect, useState } from "react";
import { adminRequest } from "../../utils/adminApi";
import AdminMetricCard from "../../components/admin/AdminMetricCard";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminRequest("/admin/dashboard")
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="admin-panel-card">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-panel-card admin-error-card">{error}</div>;
  }

  return (
    <section className="admin-page-grid">
      <div className="admin-metrics-grid">
        <AdminMetricCard
          label="Total Users"
          value={data?.totals?.totalUsers || 0}
          accent="#c4a46b"
          helper="Registered shoppers"
        />
        <AdminMetricCard
          label="Total Products"
          value={data?.totals?.totalProducts || 0}
          accent="#8c7851"
          helper="Live catalog count"
        />
        <AdminMetricCard
          label="Total Orders"
          value={data?.totals?.totalOrders || 0}
          accent="#f25042"
          helper="Orders placed so far"
        />
      </div>

      <div className="admin-two-column">
        <div className="admin-panel-card">
          <div className="admin-section-heading">
            <h2>Recent Orders</h2>
            <p>Latest checkout activity</p>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                      <div className="admin-muted">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>{order.user?.name || "Guest"}</td>
                    <td>{order.status}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel-card">
          <div className="admin-section-heading">
            <h2>Top-selling Products</h2>
            <p>Based on order line items</p>
          </div>
          <div className="admin-list-stack">
            {data?.topProducts?.map((product) => (
              <div key={product._id || product.name} className="admin-list-item">
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.unitsSold} units sold</p>
                </div>
                <span>{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
