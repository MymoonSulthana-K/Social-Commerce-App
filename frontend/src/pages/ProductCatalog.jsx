import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import "../styles/catalog.css";

function ProductCatalog() {

  const [products, setProducts] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedMajor) params.append("category", selectedMajor);
    if (selectedSub) params.append("subCategory", selectedSub);

    const url =
      "http://localhost:5000/api/products" +
      (params.toString() ? `?${params.toString()}` : "");

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Unexpected response:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setProducts([]);
      });
  }, [selectedMajor, selectedSub]);

  return (
    <div className="catalog-page">
      <CategorySidebar
        selectedMajor={selectedMajor}
        selectedSub={selectedSub}
        onSelectMajor={setSelectedMajor}
        onSelectSub={setSelectedSub}
      />

      <div className="catalog-container">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;