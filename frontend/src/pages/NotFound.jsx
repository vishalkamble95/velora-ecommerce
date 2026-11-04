import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <SearchX size={60} />

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for doesn't exist or may have been
          moved.
        </p>

        <Link to="/" className="not-found-home-button">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
