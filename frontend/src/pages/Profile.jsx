import { useEffect, useState } from "react";
import "../styles/profile.css";
import { apiRequest } from "../utils/api";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Fetch User Data
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoadingUser(false);
      }
    };

    // 2. Fetch Orders Data
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const orderData = await apiRequest("/orders/my-orders");
        setOrders(orderData || []);
      } catch (err) {
        console.error("Orders fetch error:", err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUser();
    fetchOrders();
  }, []);

  // Handle Global Loading State
  if (loadingUser) {
    return <p style={{ padding: "40px" }}>Loading profile...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="profile-container">
      {/* USER INFO SECTION */}
      <div className="profile-card">
        <h2>Your Profile</h2>
        {user && (
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ORDERS SECTION */}
      <div className="profile-card">
        <h1>Orders</h1>
        <div className="profile-info">
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : orders.length > 0 ? (
            <ul className="order-list">
              {orders.map((order) => (
                <li key={order._id} className="order-item">
                  Order #{order._id.slice(-6)} - ₹{order.totalAmount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;