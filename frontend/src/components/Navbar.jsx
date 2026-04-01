import { Link, useLocation } from "react-router-dom";
import { Package, User } from "lucide-react";
import SearchBar from "./SearchBar";
import "../styles/Navbar.css";

function Navbar() {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const profilePath = token ? "/profile" : "/login";

    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                Formali
            </Link>

            <div className="nav-center">
                <SearchBar />
                <div className="nav-links">
                    <Link to="/">HOME</Link>
                    <Link to="/products">PRODUCTS</Link>
                    <Link to="/cart">CART</Link>

                    {!token && (
                        <>
                            <Link to="/login">LOGIN</Link>
                            <Link to="/register">REGISTER</Link>
                        </>
                    )}
                </div>
            </div>

            <div className="nav-actions">
                <Link to="/orders" className="nav-icon-link" aria-label="Orders">
                    <Package size={20} />
                    <span>Orders</span>
                </Link>
                <Link to={profilePath} className="nav-icon-link profile-link" aria-label="Profile">
                    <User size={20} />
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
