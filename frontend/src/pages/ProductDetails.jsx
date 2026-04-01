import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BadgeCheck, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import "../styles/productDetails.css";
import { apiRequest } from "../utils/api";
import ReferralModal from "../components/ReferralModal"
import { resolveImageUrl } from "../utils/images";

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

  const imageUrl = resolveImageUrl(product.image);

  const rating = product.category?.toLowerCase().includes("watch") ? "4.6" : "4.7";
  const reviewCount = product.category?.toLowerCase().includes("shoe") ? 96 : 124;
  const productHighlights = [
    "Tailored for polished office and event wear",
    "Easy-to-style neutral finish for repeat use",
    "Curated quality selected for comfort and structure"
  ];
  const purchaseNotes = [
    { icon: <Truck size={18} />, text: "Free shipping on prepaid orders" },
    { icon: <ShieldCheck size={18} />, text: "Secure checkout and protected payments" },
    { icon: <BadgeCheck size={18} />, text: "Easy returns on eligible items" }
  ];

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
        <div className="product-meta-row">
          <span className="product-category-badge">
            {product.category || "Formalwear"}
          </span>
          <span className="product-rating">
            <Star size={16} fill="currentColor" />
            {rating}
            <span className="product-rating-count">({reviewCount} reviews)</span>
          </span>
        </div>

        <h1 className="product-title">
          {product.name}
        </h1>

        <p className="product-price">
          ₹{product.price}
        </p>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-detail-card">
          <div className="product-detail-header">
            <Sparkles size={18} />
            <h3>Why shoppers like it</h3>
          </div>
          <div className="product-highlights">
            {productHighlights.map((highlight) => (
              <div key={highlight} className="product-highlight-item">
                <span className="product-highlight-dot"></span>
                <p>{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="product-purchase-notes">
          {purchaseNotes.map((note) => (
            <div key={note.text} className="purchase-note">
              {note.icon}
              <span>{note.text}</span>
            </div>
          ))}
        </div>

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

        <div className="product-assurance">
          <div className="assurance-stat">
            <strong>{rating}/5</strong>
            <span>Customer rating</span>
          </div>
          <div className="assurance-stat">
            <strong>24 hrs</strong>
            <span>Referral reward window</span>
          </div>
          <div className="assurance-stat">
            <strong>50%</strong>
            <span>Referral earn potential</span>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ProductDetails;
