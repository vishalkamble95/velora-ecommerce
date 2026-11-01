import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card-image-container">
        <img
          className="product-card-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>

        <div className="product-card-prices">
          <p className="product-card-price">Price: ₹{product.price}</p>

          {product.discountPrice && (
            <p className="product-card-discount">
              Discount Price: ₹{product.discountPrice}
            </p>
          )}
        </div>

        <div className="product-card-rating">
          <Star size={17} fill="#f59e0b" color="#f59e0b" />
          <span>{product.rating} / 5</span>
        </div>

        <Link className="product-card-link" to={`/products/${product._id}`}>
          View Details
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
