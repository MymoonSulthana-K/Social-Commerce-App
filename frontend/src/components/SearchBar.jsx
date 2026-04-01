import { Search } from "lucide-react";
import "../styles/SearchBar.css";

function SearchBar() {
    return (
        <form className="search-bar" role="search">
            <Search size={18} className="search-bar__icon" aria-hidden="true" />
            <input
                type="search"
                className="search-bar__input"
                placeholder="Search products"
                aria-label="Search products"
            />
        </form>
    );
}

export default SearchBar;
