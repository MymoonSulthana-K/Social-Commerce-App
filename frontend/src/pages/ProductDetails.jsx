import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/productDetails.css";

function ProductDetails(){

  const { id } = useParams();
  const [product, setProduct] = useState(null);

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

          <button className="add-cart-btn">
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