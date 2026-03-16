import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/productDetails.css";

function ProductDetails(){

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Fetch product details when component mounts or id changes
  useEffect(() => {

    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

  }, [id]);

  if(!product){
    return <h2 className="loading">Loading...</h2>;
  }

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

  return(

    <div className="product-details-container">

      {/* Image Section */}
      <div className="product-image-section">

        <img
          src={imageUrl}
          alt={product.name}
        />

      </div>


      {/* Product Info */}
      <div className="product-info-section">

        <h1 className="product-title">
          {product.name}
        </h1>

        <p className="product-price">
          ₹{product.price}
        </p>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-actions">

          <button className="add-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>

          <button className="refer-btn">
            Refer
          </button>
        </div>

      </div>

    </div>

  )
}

export default ProductDetails;