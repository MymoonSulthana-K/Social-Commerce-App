import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, ShoppingBag, Truck } from "lucide-react";
import { apiRequest } from "../utils/api";
import "../styles/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiRequest("/orders/my-orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <section className="orders-page">
      <div className="orders-shell">
        <header className="orders-hero card">
          <div>
            <p className="orders-eyebrow">Your purchase timeline</p>
            <h1>Order History</h1>
            <p>
              Track every purchase, review delivery details, and revisit what
              you ordered.
            </p>
          </div>
          <div className="orders-hero-badge">
            <ShoppingBag size={20} />
            <span>{orders.length} orders</span>
          </div>
        </header>

        {loading ? (
          <div className="orders-state card">
            <PackageSearch size={30} />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="orders-state card orders-state-error">
            <p>{error}</p>
            <Link to="/products" className="btn">
              Continue Shopping
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-state card">
            <PackageSearch size={30} />
            <h2>No orders yet</h2>
            <p>Your order history will appear here once you place an order.</p>
            <Link to="/products" className="btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order._id} className="order-card card">
                <div className="order-card-top">
                  <div>
                    <p className="order-label">Order ID</p>
                    <h2>#{order._id.slice(-6).toUpperCase()}</h2>
                  </div>
                  <span className="order-status">{order.status || "Placed"}</span>
                </div>

                <div className="order-meta">
                  <div>
                    <p className="order-label">Placed on</p>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>
                  <div>
                    <p className="order-label">Payment</p>
                    <strong>{order.paymentMethod || "Not specified"}</strong>
                  </div>
                  <div>
                    <p className="order-label">Total</p>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                </div>

                <div className="order-items">
                  {(order.items || []).map((item, index) => {
                    const imageUrl =
                      item.image?.startsWith("http") || item.image?.startsWith("//")
                        ? item.image
                        : item.image
                          ? `http://localhost:5000${item.image}`
                          : "";

                    return (
                      <div
                        key={`${order._id}-${item.productId || index}`}
                        className="order-item-row"
                      >
                        <div className="order-item-main">
                          <div className="order-item-image-wrap">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="order-item-image"
                              />
                            ) : (
                              <div className="order-item-fallback">
                                <ShoppingBag size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3>{item.name}</h3>
                            <p>Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <strong>{formatCurrency(item.price)}</strong>
                      </div>
                    );
                  })}
                </div>

                <div className="order-footer">
                  <div className="order-shipping">
                    <Truck size={18} />
                    <span>
                      {order.shippingInfo?.city
                        ? `${order.shippingInfo.city}, ${order.shippingInfo.address}`
                        : "Shipping details available after checkout"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;
