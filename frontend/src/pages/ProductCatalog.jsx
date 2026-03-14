import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/catalog.css";

function ProductCatalog() {

  const [products, setProducts] = useState([]);

  //is the useeffect missing something? like a dependency array or something?
  //no, the empty dependency array means this will only run once when the component mounts, 
  // which is what we want for fetching products
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