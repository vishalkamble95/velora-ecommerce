import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError("");

      await logout();
      closeMenu();
      navigate("/login");
    } catch (error) {
      setError("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "header-link active" : "header-link";

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <span className="logo-icon">V</span>
          <span>
            Vel<span className="logo-highlight">ora</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation */}
        <nav
          id="main-navigation"
          className={`header-nav ${isMenuOpen ? "menu-open" : ""}`}
        >
          <NavLink to="/" className={getNavLinkClass} end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Products
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/cart"
                className={getNavLinkClass}
                onClick={closeMenu}
              >
                Cart
              </NavLink>

              <NavLink
                to="/orders"
                className={getNavLinkClass}
                onClick={closeMenu}
              >
                My Orders
              </NavLink>

              <NavLink
                to="/profile"
                className={getNavLinkClass}
                onClick={closeMenu}
              >
                Profile
              </NavLink>

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin"
                    className={getNavLinkClass}
                    end
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/products"
                    className={getNavLinkClass}
                    onClick={closeMenu}
                  >
                    Manage Products
                  </NavLink>

                  <NavLink
                    to="/admin/orders"
                    className={getNavLinkClass}
                    onClick={closeMenu}
                  >
                    Manage Orders
                  </NavLink>
                </>
              )}

              <button
                className="header-logout-button"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <div className="header-auth-links">
              <NavLink
                to="/login"
                className={getNavLinkClass}
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="header-register-button"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </div>
          )}

          {error && <p className="header-error">{error}</p>}
        </nav>
      </div>
    </header>
  );
};

export default Header;
