import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const imageUrl =
    product.image?.startsWith("http") || product.image?.startsWith("//")
      ? product.image
      : `http://localhost:5000${product.image}`;

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
            console.log("Add to cart");
          }}
        >
          Add to Cart
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Refer");
          }}
        >
          Refer
        </button>
      </div>
    </div>
  );
}

export default ProductCard;