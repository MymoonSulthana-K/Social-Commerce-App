import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import "../styles/catalog.css";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [searchParams] = useSearchParams();

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

  const searchQuery = searchParams.get("q")?.trim().toLowerCase() || "";

  const normalize = (value) =>
    (value || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const getSearchAliases = (query) => {
    const aliases = new Set([query]);

    if (query.includes("womens")) {
      aliases.add(query.replace("womens", "women"));
      aliases.add(query.replace("womens", "business"));
    }

    if (query.includes("women")) {
      aliases.add(query.replace("women", "business"));
    }

    if (query.includes("suit")) {
      aliases.add("men suits");
      aliases.add("business suits");
    }

    if (query.includes("shoe")) {
      aliases.add("men shoes");
      aliases.add("women footwear");
    }

    if (query.includes("bag")) {
      aliases.add("bags");
    }

    return Array.from(aliases);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }

    const aliases = getSearchAliases(normalize(searchQuery));

    return products.filter((product) => {
      const haystack = normalize(
        `${product.name} ${product.category} ${product.description}`
      );

      return aliases.some((alias) => haystack.includes(alias));
    });
  }, [products, searchQuery]);

  return (
    <div className="catalog-page">
      <CategorySidebar
        selectedMajor={selectedMajor}
        selectedSub={selectedSub}
        onSelectMajor={setSelectedMajor}
        onSelectSub={setSelectedSub}
      />

      <div className="catalog-container">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
