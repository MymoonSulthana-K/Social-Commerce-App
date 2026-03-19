import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/catalog.css";

function ProductCatalog() {

  const [products, setProducts] = useState([]);
  
  useEffect(() => {
        fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="catalog-container">

      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}

    </div>
  );
}

export default ProductCatalog;