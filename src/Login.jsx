import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, ShieldCheck, Clock, BadgeCheck, Mail, Lock } from "lucide-react";
import Api from "./Api.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await Api.post("/auth/login", formData);
      const { token, role, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "USER") {
        navigate("/my-requests");
      } else if (role === "PROVIDER") {
        navigate("/provider/requests");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid email or password";
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
          <h1>Professional home services at your fingertips.</h1>
          <p>
            Connect with certified electricians, plumbers, appliance technicians and cleaners.
            Track your requests in real time or manage incoming service dispatches effortlessly.
          </p>

          <div className="auth-hero-points">
            <span className="auth-hero-point">
              <BadgeCheck size={18} /> Verified, category-certified specialists
            </span>
            <span className="auth-hero-point">
              <Clock size={18} /> Same-day dispatch and live status tracking
            </span>
            <span className="auth-hero-point">
              <ShieldCheck size={18} /> Transparent upfront pricing, no surprises
            </span>
          </div>
        </div>

        <div className="auth-hero-footer">Reliable • Fast • Transparent Pricing</div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form">
          <h2>Sign In</h2>
          <p className="auth-form-subtitle">
            Enter your credentials to access your account
          </p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-with-icon">
                <span className="field-icon">
                  <Mail size={17} />
                </span>
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <div className="input-with-icon">
                  <span className="field-icon">
                    <Lock size={17} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
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

            <button type="submit" className="btn btn-block btn-lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>
          </form>

          <p className="auth-form-footer">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
