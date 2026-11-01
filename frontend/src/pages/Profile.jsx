import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserRound,
  Mail,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  ArrowRight,
} from "lucide-react";

import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

const Profile = () => {
  const { user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError("");

      await logout();
    } catch (error) {
      setError(
        error.response?.data?.message || "Logout failed. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <UserRound size={42} />
          <h2>Login Required</h2>
          <p>Please login to view your profile.</p>
          <Link to="/login" className="profile-login-btn">
            Login Now <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account information.</p>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              <UserRound size={38} />
            </div>

            <div className="profile-user-heading">
              <h3>{user.name}</h3>
              <span>{user.role}</span>
            </div>
          </div>

          <div className="profile-information">
            <h3>Account Information</h3>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <UserRound size={20} />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{user.name}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <span>Account Role</span>
                <strong className="profile-role">{user.role}</strong>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/orders" className="profile-orders-btn">
              <ShoppingBag size={19} />
              My Orders
              <ArrowRight size={17} />
            </Link>

            <ErrorMessage message={error} />

            <div className="profile-logout-btn">
              <Button onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut size={17} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
