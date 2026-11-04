import { useState } from "react";

import {
  useProducts,
  useProductCategories,
} from "../features/products/useProducts";
import useDebounce from "../hooks/useDebounce";

import ProductCard from "../components/products/ProductCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data: categoryData } = useProductCategories();

  const { data, isLoading, isError } = useProducts({
    search: debouncedSearch,
    category,
    minPrice,
    maxPrice,
    sortBy,
    page,
  });

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setPage(1);
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="products-error-container">
        <ErrorMessage message="Failed to load products. Please try again." />

        <button
          className="products-retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="products-page">
      {/* Page Heading */}
      <div className="products-heading">
        <div>
          <span className="products-eyebrow">OUR COLLECTION</span>
          <h1>All Products</h1>
          <p>Explore our collection and find products you'll love.</p>
        </div>

        <div className="products-heading-icon">
          <PackageSearch size={35} />
        </div>
      </div>

      {/* Filters Section */}
      <div className="products-filter-section">
        <div className="products-filter-heading">
          <div className="products-filter-title">
            <SlidersHorizontal size={19} />
            <h3>Filter Products</h3>
          </div>

          <button
            type="button"
            className="products-clear-button"
            onClick={handleClearFilters}
          >
            <RotateCcw size={15} />
            Clear Filters
          </button>
        </div>

        <div className="products-filter-grid">
          {/* Search */}
          <div className="products-filter-group products-search-group">
            <label htmlFor="product-search">Search Products</label>

            <div className="products-search-input-wrapper">
              <Search size={18} />

              <input
                id="product-search"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div className="products-filter-group">
            <label htmlFor="product-category">Category</label>

            <select
              id="product-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>

              {categoryData?.categories?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Price */}
          <div className="products-filter-group">
            <label htmlFor="minimum-price">Minimum Price</label>

            <input
              id="minimum-price"
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Maximum Price */}
          <div className="products-filter-group">
            <label htmlFor="maximum-price">Maximum Price</label>

            <input
              id="maximum-price"
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Sorting */}
          <div className="products-filter-group">
            <label htmlFor="product-sort">Sort By</label>

            <select
              id="product-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Default Sorting</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="products-empty-state">
          <div className="products-empty-icon">
            <PackageSearch size={42} />
          </div>

          <h3>No Products Found</h3>

          <p>Try changing your search or filters.</p>

          <button
            type="button"
            className="products-empty-button"
            onClick={handleClearFilters}
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {/* Bottom Product Count and Pagination */}
      <div className="products-bottom-bar">
        <div className="products-bottom-count">
          Showing{" "}
          <strong>
            {products.length === 0 ? 0 : (page - 1) * (data?.limit || 12) + 1}-
            {products.length === 0
              ? 0
              : (page - 1) * (data?.limit || 12) + products.length}
          </strong>{" "}
          of <strong>{data?.totalProducts || 0}</strong> products
        </div>

        <div className="products-bottom-controls">
          <button
            type="button"
            className="products-page-button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <span className="products-page-info">
            Page <strong>{data?.currentPage}</strong> of{" "}
            <strong>{data?.totalPages}</strong>
          </span>

          <button
            type="button"
            className="products-page-button"
            disabled={page === data?.totalPages || data?.totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
