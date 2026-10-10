import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, FolderOpen, ArrowRight, Wrench } from "lucide-react";
import Api from "./Api.jsx";

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.get("/categories");
        setCategories(response.data);
      } catch {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRequest = (categoryId) => {
    navigate(`/requests/new?categoryId=${categoryId}`);
  };

  const visibleCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = categories.filter((cat) => {
      if (!term) return true;
      return (
        cat.name.toLowerCase().includes(term) ||
        (cat.description || "").toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [categories, searchTerm, sortBy]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Home Services</h1>
          <p className="page-subtitle">
            Select a verified service category to book skilled professionals for your home needs.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="toolbar">
        <div className="toolbar-search">
          <div className="input-with-icon">
            <span className="field-icon">
              <Search size={17} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
            />
          </div>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort services"
          >
            <option value="popular">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-block">Loading services...</div>
      ) : visibleCategories.length === 0 ? (
        <div className="card">
          <div className="empty-state-block">
            <FolderOpen size={40} />
            <h3>No services found</h3>
            <p>Try a different search term or clear the filter.</p>
          </div>
        </div>
      ) : (
        <div className="grid auto-grid-wide">
          {visibleCategories.map((category) => (
            <article className="service-card" key={category.id}>
              <div className="service-card-top">
                <span className="category-icon">
                  <Wrench size={24} />
                </span>
                <span className="chip">Service</span>
              </div>
              <h3>{category.name}</h3>
              <p className="muted">
                {category.description ||
                  "Top-rated professionals delivering verified on-site service."}
              </p>
              <div className="service-card-foot">
                <div>
                  <span className="service-price-label">Starting at</span>
                  <span className="price-tag">Rs. {category.basePrice}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handleRequest(category.id)}
                >
                  Book Now <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
