import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/productDetails.css";
import { apiRequest } from "../utils/api";
import ReferralModal from "../components/ReferralModal"

function ProductDetails() {
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  useEffect(() => {
    if (refCode) {
      // Store in localStorage so it persists if they navigate away and come back
      localStorage.setItem('activeReferral', refCode);
    }
  }, [refCode]);

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Fetch product details when component mounts or id changes
  useEffect(() => {

    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

  }, [id]);

  if (!product) {
    return <h2 className="loading">Loading...</h2>;
  }

  const imageUrl =
    product.image?.startsWith("http") || product.image?.startsWith("//")
      ? product.image
      : `http://localhost:5000${product.image}`;

  const addToCart = async () => {
    try {
      await apiRequest("/cart/add", {
        method: "POST",
        body: JSON.stringify({
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image
          }
        })
      });
      alert("Product added to cart!");
    } catch (err) {
      alert("Error adding to cart: " + err.message);
    }
  };

  return (

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

          <button onClick={() => setShowModal(true)} className="refer-btn">
            Refer & Earn 50%
          </button>

          {/* Render the Modal conditionally */}
          {showModal && (
            <ReferralModal
              product={product}
              onClose={() => setShowModal(false)}
            />)}
        </div>
      </div>
    </div>

  )
}

export default ProductDetails;