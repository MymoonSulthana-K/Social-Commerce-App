import { Link } from "react-router-dom";
import "../styles/home.css";
import heroImage from "../assets/images/home.jpg";

function Home() {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-text">
          <h1>Elevate Your Office Style</h1>

          <p>
            Discover curated formal outfits designed for professionals.
            Look sharp. Feel confident.
          </p>

          <Link to="/products">
            <button className="hero-btn">Shop Now</button>
          </Link>
        </div>

        <div className="hero-image">
          <img
            src = {heroImage}
            alt="Formal outfit"
          />
        </div>

      </section>

    </div>
  );
}

export default Home;