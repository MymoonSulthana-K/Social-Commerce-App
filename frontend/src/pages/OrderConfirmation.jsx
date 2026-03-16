import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/orderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Check if order data was passed through the navigate state
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // If no order data is existing means redirect to home
      navigate("/");
    }
  }, [location, navigate]);

  if (!order) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase</p>
        </div>

        <div className="order-details">
          <div className="order-info">
            <h3>Order #{order.orderId}</h3>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
          </div>

          <div className="shipping-info">
            <h3>Shipping Address</h3>
            <p>{order.shippingInfo.name}</p>
            <p>{order.shippingInfo.address}</p>
            <p>{order.shippingInfo.city}, {order.shippingInfo.zipCode}</p>
            <p>{order.shippingInfo.phone}</p>
            <p>{order.shippingInfo.email}</p>
          </div>

          <div className="order-items">
            <h3>Order Items</h3>
            {order.items.map((item, index) => {
              const imageUrl =
                item.image?.startsWith("http") || item.image?.startsWith("//")
                  ? item.image
                  : `http://localhost:5000${item.image}`;

              return (
                <div key={item._id || index} className="confirmation-item">
                  <div className="item-image">
                    <img src={imageUrl} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-total">
            <h3>Total: ₹{order.total}</h3>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/products" className="btn continue-shopping">
            Continue Shopping
          </Link>
          <Link to="/profile" className="btn view-orders">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;