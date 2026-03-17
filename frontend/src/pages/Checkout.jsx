import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import { apiRequest } from "../utils/api";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discountedItems, setDiscountedItems] = useState([]); // Track which products get 50% off
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

  // 1. Fetch Cart and then calculate discounted total
  useEffect(() => {
    const fetchCartForCheckout = async () => {
      try {
        const cartData = await apiRequest("/cart/cart");

        if (cartData && cartData.items.length > 0) {
          setCartItems(cartData.items);
          // Pass items directly to calculation to ensure state sync
          await calculateTotal(cartData.items);
        } else {
          navigate("/cart");
        }
      } catch (err) {
        console.error("Checkout fetch error:", err);
        navigate("/cart");
      }
    };

    fetchCartForCheckout();
  }, [navigate]);

  // 2. Modified calculateTotal to check Referral Status per product
  const calculateTotal = async (items) => {
    let currentSubtotal = 0;
    let dItems = [];

    for (const item of items) {
      try {
        // Check if the current user has a completed referral session for this product
        const status = await apiRequest(`/referral/status/${item.productId}`);
        
        if (status && status.isCompleted) {
          // Apply 50% discount
          currentSubtotal += (item.price * 0.5) * item.quantity;
          dItems.push(item.productId); // Mark as discounted for UI
        } else {
          currentSubtotal += item.price * item.quantity;
        }
      } catch (err) {
        // Fallback to normal price if API fails or no referral exists
        currentSubtotal += item.price * item.quantity;
      }
    }

    setDiscountedItems(dItems);
    const shippingFee = currentSubtotal > 500 ? 0 : 50;
    setTotal(currentSubtotal + shippingFee);
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

    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address ||
        !shippingInfo.city || !shippingInfo.zipCode || !shippingInfo.phone) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Send the final calculated total and items to the backend
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
          total, // This is the total after referral discounts
          discountedItems // Helpful for backend verification
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("cart");
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

  // UI Helper for Subtotal (for display purposes)
  const displaySubtotal = total - (total > 500 || total === 0 ? 0 : 50);

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
                <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" value={shippingInfo.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} rows="3" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input type="text" id="zipCode" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>UPI</span>
                </label>
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn place-order-btn">Place Order</button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map(item => {
              const isDiscounted = discountedItems.includes(item.productId);
              const imageUrl = item.image?.startsWith("http") ? item.image : `http://localhost:5000${item.image}`;

              return (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-image">
                    <img src={imageUrl} alt={item.name} />
                  </div>
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    {isDiscounted ? (
                      <p className="summary-item-price">
                        <span className="old-price" style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>
                          ₹{item.price * item.quantity}
                        </span>
                        <span className="new-price" style={{color: '#27ae60', fontWeight: 'bold'}}>
                          ₹{(item.price * 0.5) * item.quantity}
                        </span>
                      </p>
                    ) : (
                      <p className="summary-item-price">₹{item.price * item.quantity}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{displaySubtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{total > 500 || displaySubtotal > 500 ? "Free" : "₹50"}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;