import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import "../styles/cart.css";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/images";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiRequest("/cart/cart");
      setCart(cartData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await apiRequest("/cart/update", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await apiRequest("/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      await apiRequest("/cart/clear", {
        method: "POST"
      });
      await fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };


  if (loading) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Error: {error}</p>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/products" className="btn">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cartItems.map(item => {
          const imageUrl = resolveImageUrl(item.image);

          return (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-image">
                <img src={imageUrl} alt={item.name} />
              </div>

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price}</p>
              </div>

              <div className="cart-item-quantity">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                ₹{item.price * item.quantity}
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ₹{total}</h3>
        </div>

        <div className="cart-actions">
          <button onClick={clearCart} className="btn secondary">
            Clear Cart
          </button>
          <Link to="/checkout" className="btn primary">
    Proceed to Checkout
  </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
