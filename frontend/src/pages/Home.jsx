import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/home.css";
import homeImage from "../assests/images/heroimage.png";
import { ArrowRight, Share2, Users, Clock, Gift, Search, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { apiRequest } from "../utils/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    apiRequest("/products")
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setProducts(data);
          setError(null);
        } else {
          setProducts([]);
          setError("Unexpected product response");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setProducts([]);
        setError(err.message || "Failed to load products");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))
  ];

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = filteredProducts.slice(0, 8);

  const features = [
    {
      icon: <Share2 size={28} />,
      title: "Share a Product",
      desc: "Find something you love and share it with friends."
    },
    {
      icon: <Users size={28} />,
      title: "3 Friends Buy",
      desc: "When your friends purchase, everyone benefits."
    },
    {
      icon: <Clock size={28} />,
      title: "24 Hour Window",
      desc: "Limited time to unlock special discounts."
    },
    {
      icon: <Gift size={28} />,
      title: "Save Together",
      desc: "Group shopping gives everyone better prices."
    }
  ];

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <img src={homeImage} alt="Fashion" className="hero-bg" />

        <div className="overlay"></div>

        <div className="hero-content">
          <h1>
            Elevate Your <span>Office Style</span>
          </h1>
          <p>
            Discover curated formal outfits designed for professionals.
            Look sharp. Feel confident.
          </p>

          <Link to="/products">
            <button className="hero-btn">
              Shop Now <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Get 50% Off Now!</h2>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products">
        <div className="product-header">
          <h2>The Collection</h2>
          <Link to="/products">View All →</Link>
        </div>

        <div className="product-controls">
          <div className="search-box">
            <Search size={18} className="search-box__icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search featured pieces like suits, shoes, or bags"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search featured products"
            />
            {search.trim() && (
              <button
                type="button"
                className="search-box__clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="category-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? "chip active" : "chip"}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="error">Error loading products: {error}</p>
          ) : featured.length > 0 ? (
            featured.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Upgrade Your Style?</h2>
        <p>Join professionals who dress smarter every day.</p>

        <Link to="/products">
          <button className="cta-btn">
            Start Shopping <ArrowRight size={18} />
          </button>
        </Link>
      </section>

    </div>
  );
}

export default Home;
