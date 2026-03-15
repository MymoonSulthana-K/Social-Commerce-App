import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const imageUrl =
    product.image?.startsWith("http") || product.image?.startsWith("//")
      ? product.image
      : `http://localhost:5000${product.image}`;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
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