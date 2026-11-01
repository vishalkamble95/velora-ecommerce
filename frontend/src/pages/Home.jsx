import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <Sparkles size={16} />
            <span>Welcome to Velora</span>
          </div>

          <h1>
            Discover Products
            <span> You'll Love.</span>
          </h1>

          <p>
            Explore a wide range of quality products at great prices. Enjoy a
            simple, convenient and secure shopping experience.
          </p>

          <Link to="/products" className="home-hero-button">
            Explore Products
            <ArrowRight size={19} />
          </Link>

          <div className="home-hero-note">
            <ShoppingBag size={17} />
            <span>Your shopping journey starts here.</span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-decoration hero-decoration-one"></div>
          <div className="hero-decoration hero-decoration-two"></div>

          <div className="hero-shopping-card">
            <ShoppingBag size={90} strokeWidth={1.3} />

            <h3>Happy Shopping!</h3>

            <p>Find something you love today.</p>

            <div className="hero-card-bottom">
              <span>Explore</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Benefits */}
      <section className="home-benefits">
        <div className="home-section-heading">
          <span>WHY CHOOSE US</span>
          <h2>A Better Way to Shop</h2>
          <p>Enjoy a convenient shopping experience with Velora.</p>
        </div>

        <div className="home-benefits-grid">
          <div className="home-benefit-card">
            <div className="home-benefit-icon blue">
              <ShoppingBag size={25} />
            </div>

            <h3>Quality Products</h3>

            <p>
              Explore our collection and find products that suit your needs.
            </p>
          </div>

          <div className="home-benefit-card">
            <div className="home-benefit-icon green">
              <Truck size={25} />
            </div>

            <h3>Easy Shopping</h3>

            <p>Browse products and place your orders with ease.</p>
          </div>

          <div className="home-benefit-card">
            <div className="home-benefit-icon purple">
              <ShieldCheck size={25} />
            </div>

            <h3>Secure Experience</h3>

            <p>Enjoy a straightforward and secure shopping experience.</p>
          </div>

          <div className="home-benefit-card">
            <div className="home-benefit-icon orange">
              <Headphones size={25} />
            </div>

            <h3>Customer Friendly</h3>

            <p>A simple and user-friendly platform for your shopping needs.</p>
          </div>
        </div>
      </section>

      {/* Shopping Call To Action */}
      <section className="home-cta">
        <div>
          <h2>Ready to Find Your Next Favourite Product?</h2>

          <p>Explore our collection and discover something special.</p>
        </div>

        <Link to="/products" className="home-cta-button">
          Start Shopping
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default Home;
