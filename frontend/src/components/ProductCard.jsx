import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const imageUrl =
    product.image?.startsWith("http") || product.image?.startsWith("//")
      ? product.image
      : `http://localhost:5000${product.image}`;

  const addToCart = async () => {
    try {
      await apiRequest("/cart/add", {
        method: "POST",
        body: JSON.stringify({ product }),
      });
      alert("Product added to cart!");
    } catch (err) {
      alert("Failed to add to cart: " + err.message);
    }
  };

  return (
    <div className="product-card"onClick={() => navigate(`/product/${product._id}`)}>
      <div className="product-image">
      <img src={imageUrl} alt={product.name} />
      </div>

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <div className="product-buttons">

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart();
          }}
        >
          Add to Cart
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Share and Earn Discount");
          }}
        >
          Refer
        </button>
      </div>
    </div>
  );
}

export default ProductCard;