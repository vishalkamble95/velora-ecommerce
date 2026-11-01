import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">V</span>
              <span>
                Vel<span className="footer-logo-highlight">ora</span>
              </span>
            </Link>

            <p className="footer-description">
              Shop your favourite products at the best prices. Discover quality
              products and enjoy a seamless shopping experience with us.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links-section">
            <h3>Quick Links</h3>

            <nav className="footer-nav">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile">My Account</Link>
                  <Link to="/orders">My Orders</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </nav>
          </div>

          {/* Shopping Information */}
          <div className="footer-info-section">
            <h3>Shopping with Us</h3>

            <p>Quality Products</p>
            <p>Easy Shopping</p>
            <p>Secure Experience</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Velora. All rights reserved.</p>

          <p className="footer-made-text">
            Made with care for a better shopping experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
