import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    const token = localStorage.getItem("token"); // Check if the user is logged in by checking for a token in localStorage
    return (

        <nav className="navbar">
            <h2 className="logo">Formali</h2>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart</Link>
                
                {token ? (
                    <Link to="/profile">Profile</Link>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;