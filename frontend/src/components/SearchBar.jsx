import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "../styles/SearchBar.css";

function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            navigate("/products");
            return;
        }

        navigate(`/products?q=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <form className="search-bar" role="search" onSubmit={handleSubmit}>
            <Search size={18} className="search-bar__icon" aria-hidden="true" />
            <input
                type="search"
                className="search-bar__input"
                placeholder="Search suits, shoes, bags..."
                aria-label="Search products"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
        </form>
    );
}

export default SearchBar;
