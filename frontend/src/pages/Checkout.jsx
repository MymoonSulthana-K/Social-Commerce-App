import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Removed useSearchParams as it's no longer needed
import "../styles/checkout.css";
import { apiRequest } from "../utils/api";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

useEffect(() => {
  const fetchCartForCheckout = async () => {
    try {
      // Fetch from the backend, just like your Cart page does
      const cartData = await apiRequest("/cart/cart"); 
      
      if (cartData && cartData.items.length > 0) {
        setCartItems(cartData.items);
        calculateTotal(cartData.items);
      } else {
        // Only redirect if the database says the cart is actually empty
        navigate("/cart");
      }
    } catch (err) {
      console.error("Checkout fetch error:", err);
      navigate("/cart");
    }
  };

  fetchCartForCheckout();
}, [navigate]);

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    setTotal(subtotal + shipping);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address ||
        !shippingInfo.city || !shippingInfo.zipCode || !shippingInfo.phone) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          shippingInfo,
          paymentMethod,
          total
          // referralCode removed from payload
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart
        localStorage.removeItem("cart");

        // Redirect to order confirmation with order data
        navigate("/order-confirmation", {
          state: {
            order: {
              ...data,
              items: cartItems,
              shippingInfo,
              paymentMethod,
              total,
              orderDate: new Date().toISOString()
            }
          }
        });
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      alert("Error placing order: " + error.message);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Shipping Information</h3>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  rows="3"
                  
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Method</h3>

              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn place-order-btn">
              Place Order
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-items">
            {cartItems.map(item => {
              const imageUrl =
                item.image?.startsWith("http") || item.image?.startsWith("//")
                  ? item.image
                  : `http://localhost:5000${item.image}`;

              return (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-image">
                    <img src={imageUrl} alt={item.name} />
                  </div>
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="summary-item-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>

          {subtotal < 500 && (
            <p className="free-shipping-note">
              Add ₹{500 - subtotal} more for free shipping!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;