import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, BadgeCheck, Clock, ShieldCheck, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import Api from "./Api.jsx";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "USER",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.get("/auth/categories");
        setCategories(response.data);
      } catch {
        // Categories can be fetched if available
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        categoryId:
          formData.role === "PROVIDER" && formData.categoryId
            ? Number(formData.categoryId)
            : null,
      };

      await Api.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Registration failed. Please check your information.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-hero">
        <div className="auth-hero-brand">
          <Zap size={22} fill="var(--accent)" color="var(--accent)" />
          HOME SERVICES
        </div>

        <div className="auth-hero-content">
          <h1>Join our platform today.</h1>
          <p>
            Whether you need prompt home maintenance or you are a professional tradesperson
            looking for high-demand jobs, Home Services empowers your journey.
          </p>

          <div className="auth-hero-points">
            <span className="auth-hero-point">
              <BadgeCheck size={18} /> Fast onboarding in under two minutes
            </span>
            <span className="auth-hero-point">
              <Clock size={18} /> Direct booking with live status updates
            </span>
            <span className="auth-hero-point">
              <ShieldCheck size={18} /> Verified service providers only
            </span>
          </div>
        </div>

        <div className="auth-hero-footer">
          Fast Onboarding • Direct Booking • Verified Providers
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form">
          <h2>Create Account</h2>
          <p className="auth-form-subtitle">Sign up as a customer or service provider</p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="register-role">I want to register as</label>
              <select
                id="register-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="USER">Customer (Book Services)</option>
                <option value="PROVIDER">Service Provider (Accept Jobs)</option>
              </select>
            </div>

            {formData.role === "PROVIDER" && (
              <div className="field">
                <label htmlFor="register-category">Service Category Specialty *</label>
                <select
                  id="register-category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialty</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="field">
              <label htmlFor="register-name">Full Name *</label>
              <div className="input-with-icon">
                <span className="field-icon">
                  <User size={17} />
                </span>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-email">Email Address *</label>
              <div className="input-with-icon">
                <span className="field-icon">
                  <Mail size={17} />
                </span>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-password">Password * (min 6 characters)</label>
              <div className="password-wrap">
                <div className="input-with-icon">
                  <span className="field-icon">
                    <Lock size={17} />
                  </span>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-phone">Phone Number</label>
              <div className="input-with-icon">
                <span className="field-icon">
                  <Phone size={17} />
                </span>
                <input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-address">Location / Address</label>
              <div className="input-with-icon">
                <span className="field-icon">
                  <MapPin size={17} />
                </span>
                <input
                  id="register-address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, city"
                  autoComplete="street-address"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-block btn-lg" disabled={loading}>
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </form>

          <p className="auth-form-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
