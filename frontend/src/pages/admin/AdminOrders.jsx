import { useEffect, useState } from "react";
import { adminRequest } from "../../utils/adminApi";

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

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const normalizeStatus = (status) => (status === "Placed" ? "Pending" : status);

  const loadOrders = async (status = "") => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const data = await adminRequest(`/admin/orders${query}`);
    setOrders(data);

    if (data[0]) {
      const details = await adminRequest(`/admin/orders/${data[0]._id}`);
      setSelectedOrder(details);
    } else {
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    loadOrders(statusFilter).catch((err) =>
      setError(err.message || "Failed to load orders")
    );
  }, [statusFilter]);

  const loadOrderDetails = async (orderId) => {
    try {
      const data = await adminRequest(`/admin/orders/${orderId}`);
      setSelectedOrder(data);
    } catch (err) {
      setError(err.message || "Failed to load order details");
    }
  };

  const updateStatus = async (status) => {
    if (!selectedOrder) return;

    try {
      const updatedOrder = await adminRequest(
        `/admin/orders/${selectedOrder._id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        }
      );
      setSelectedOrder(updatedOrder);
      await loadOrders(statusFilter);
    } catch (err) {
      setError(err.message || "Failed to update order status");
    }
  };

  return (
    <section className="admin-two-column">
      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>Orders</h2>
          <p>Filter and inspect order flow</p>
        </div>

        <div className="admin-filter-row">
          {[
            { value: "", label: "All" },
            { value: "Placed", label: "Pending" },
            { value: "Completed", label: "Completed" },
          ].map((statusOption) => (
            <button
              key={statusOption.value || "all"}
              type="button"
              className={
                statusFilter === statusOption.value ? "admin-chip active" : "admin-chip"
              }
              onClick={() => setStatusFilter(statusOption.value)}
            >
              {statusOption.label}
            </button>
          ))}
        </div>

        {error ? <p className="admin-inline-error">{error}</p> : null}

        <div className="admin-list-stack">
          {orders.map((order) => (
            <button
              key={order._id}
              type="button"
              className={
                selectedOrder?._id === order._id
                  ? "admin-user-row active"
                  : "admin-user-row"
              }
              onClick={() => loadOrderDetails(order._id)}
            >
              <div>
                <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                <p>{order.user?.name || "Guest"}</p>
              </div>
              <span>{normalizeStatus(order.status)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>Order details</h2>
          <p>Line items, shipping and status updates</p>
        </div>

        {selectedOrder ? (
          <div className="admin-detail-stack">
            <div className="admin-detail-card">
              <h3>#{selectedOrder._id.slice(-6).toUpperCase()}</h3>
              <p>{selectedOrder.user?.name || "Guest"}</p>
              <small>{formatDate(selectedOrder.createdAt)}</small>
            </div>
            <div className="admin-inline-metrics">
              <div>
                <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{selectedOrder.items.length}</strong>
                <span>Items</span>
              </div>
              <div>
                <strong>{selectedOrder.paymentMethod}</strong>
                <span>Payment</span>
              </div>
            </div>

            <div className="admin-order-status-row">
              <span>Current status: {normalizeStatus(selectedOrder.status)}</span>
              <div className="admin-filter-row">
                {[
                  { value: "Placed", label: "Mark Pending" },
                  { value: "Completed", label: "Mark Completed" },
                ].map((statusOption) => (
                  <button
                    key={statusOption.value}
                    type="button"
                    className={
                      selectedOrder.status === statusOption.value
                        ? "admin-chip active"
                        : "admin-chip"
                    }
                    onClick={() => updateStatus(statusOption.value)}
                  >
                    {statusOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4>Items</h4>
              <div className="admin-list-stack compact">
                {selectedOrder.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="admin-list-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>Qty {item.quantity}</p>
                    </div>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>Select an order to view details.</p>
        )}
      </div>
    </section>
  );
}

export default AdminOrders;
