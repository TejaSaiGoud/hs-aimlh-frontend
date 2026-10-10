import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench,
  Zap,
  Sparkles,
  Refrigerator,
  PaintRoller,
  Hammer,
  Bug,
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  CreditCard,
  BadgeCheck,
  Star,
  ArrowRight,
  UserPlus,
  Briefcase,
  Phone,
  Mail,
  ChevronRight,
  Quote,
  Tag,
  CheckCircle2,
} from "lucide-react";
import "./Home.css";

const serviceCategories = [
  { icon: Wrench, name: "Plumbing", desc: "Leaks, pipes, faucets & drains", price: "Rs. 500" },
  { icon: Zap, name: "Electrical", desc: "Wiring, breakers & fittings", price: "Rs. 600" },
  { icon: Sparkles, name: "Cleaning", desc: "Deep clean & sanitization", price: "Rs. 800" },
  { icon: Refrigerator, name: "Appliance Maintenance", desc: "AC, fridge & washing machine", price: "Rs. 700" },
  { icon: PaintRoller, name: "Painting", desc: "Interior & exterior walls", price: "Rs. 900" },
  { icon: Hammer, name: "Carpentry", desc: "Furniture, doors & fittings", price: "Rs. 650" },
  { icon: Bug, name: "Pest Control", desc: "Termite & cockroach treatment", price: "Rs. 750" },
];

const popularServices = [
  { name: "Tap & Leak Repair", category: "Plumbing", price: "Rs. 500", jobs: "1.2k jobs" },
  { name: "Ceiling Fan Installation", category: "Electrical", price: "Rs. 600", jobs: "980 jobs" },
  { name: "Full Home Deep Clean", category: "Cleaning", price: "Rs. 1,800", jobs: "740 jobs" },
  { name: "AC Gas Refill", category: "Appliance Maintenance", price: "Rs. 1,200", jobs: "610 jobs" },
];

const featuredProviders = [
  { name: "Ramesh Kumar", category: "Plumbing", rating: 4.9, jobs: 320, price: "Rs. 500", verified: true },
  { name: "Sunita Rao", category: "Cleaning", rating: 4.8, jobs: 410, price: "Rs. 800", verified: true },
  { name: "Arjun Mehta", category: "Electrical", rating: 4.9, jobs: 275, price: "Rs. 600", verified: true },
  { name: "Farhan Ali", category: "Appliance Maintenance", rating: 4.7, jobs: 198, price: "Rs. 700", verified: true },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Homeowner, Pune",
    text: "Booked a plumber in under two minutes and he arrived the same afternoon. Transparent pricing, no surprises.",
  },
  {
    name: "Vikram Nair",
    role: "Apartment Manager",
    text: "We manage maintenance for 40 flats. The dispatch board and status tracking have saved us hours every week.",
  },
  {
    name: "Ananya Iyer",
    role: "Homeowner, Bengaluru",
    text: "Every professional was verified and polite. The AC service was thorough and the price matched the quote exactly.",
  },
];

const trustPoints = [
  { icon: BadgeCheck, title: "Verified Providers", desc: "Every specialist is vetted and category-certified." },
  { icon: CreditCard, title: "Transparent Pricing", desc: "Upfront base rates with zero hidden charges." },
  { icon: Clock, title: "Same-Day Dispatch", desc: "Requests broadcast instantly to qualified pros." },
  { icon: ShieldCheck, title: "Service Guarantee", desc: "Issues after a job? We make it right, free." },
];

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Pune");

  const dashboardLink = useMemo(() => {
    if (role === "ADMIN") return "/admin";
    if (role === "PROVIDER") return "/provider/requests";
    return "/my-requests";
  }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    const target = token ? "/services" : "/register";
    navigate(`${target}?q=${encodeURIComponent(query)}`);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: "start" });
  };

  return (
    <div className="home">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="home-nav">
        <div className="container home-nav-inner">
          <Link to="/" className="home-brand">
            <Zap size={22} fill="var(--accent)" color="var(--accent)" />
            HOME SERVICES
          </Link>

          <nav className="home-nav-links">
            <button type="button" className="home-nav-link" onClick={() => scrollTo("categories")}>
              Services
            </button>
            <button type="button" className="home-nav-link" onClick={() => scrollTo("providers")}>
              Providers
            </button>
            <button type="button" className="home-nav-link" onClick={() => scrollTo("offers")}>
              Offers
            </button>
            <button type="button" className="home-nav-link" onClick={() => scrollTo("testimonials")}>
              Reviews
            </button>
          </nav>

          <div className="home-nav-actions">
            {token ? (
              <>
                <Link to={dashboardLink} className="home-nav-ghost">
                  Bookings
                </Link>
                <Link to={dashboardLink} className="btn btn-sm">
                  Dashboard <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="home-nav-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <Sparkles size={15} /> On-demand home maintenance
            </span>
            <h1 className="hero-title">
              Your Home, <span>Our Priority.</span>
            </h1>
            <p className="hero-text">
              Book verified plumbers, electricians, cleaners, AC technicians, painters and carpenters.
              Transparent pricing, same-day dispatch, and end-to-end booking tracking.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="hero-search-field">
                <Search size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What service do you need?"
                  aria-label="Search for a home service"
                />
              </div>
              <div className="hero-search-location">
                <MapPin size={18} />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-label="Select your location"
                >
                  <option>Pune</option>
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                  <option>Delhi</option>
                  <option>Hyderabad</option>
                </select>
              </div>
              <button type="submit" className="btn hero-search-btn">
                <Search size={17} /> Search
              </button>
            </form>

            <div className="hero-cta-row">
              <Link to="/register" className="btn btn-lg">
                <UserPlus size={18} /> Book a Service
              </Link>
              <Link to="/register" className="btn btn-lg btn-outline-light">
                <Briefcase size={18} /> Join as Provider
              </Link>
            </div>

            <ul className="hero-stats">
              <li>
                <strong>12k+</strong>
                <span>Bookings completed</span>
              </li>
              <li>
                <strong>850+</strong>
                <span>Verified providers</span>
              </li>
              <li>
                <strong>4.9/5</strong>
                <span>Average rating</span>
              </li>
            </ul>
          </div>

          <aside className="hero-card" aria-label="Live service request preview">
            <div className="hero-card-head">
              <span className="hero-card-dot" />
              Live dispatch board
            </div>
            <div className="hero-card-body">
              <div className="hero-mini-row">
                <span className="avatar avatar-sm">{initialsOf("Ramesh Kumar")}</span>
                <div className="stack-sm">
                  <span className="hero-mini-name">Ramesh Kumar</span>
                  <span className="hero-mini-meta">Plumbing · 4.9 ★</span>
                </div>
                <span className="badge-pill badge-assigned">En route</span>
              </div>
              <div className="hero-mini-row">
                <span className="avatar avatar-sm">{initialsOf("Sunita Rao")}</span>
                <div className="stack-sm">
                  <span className="hero-mini-name">Sunita Rao</span>
                  <span className="hero-mini-meta">Cleaning · 4.8 ★</span>
                </div>
                <span className="badge-pill badge-in_progress">Working</span>
              </div>
              <div className="hero-mini-row">
                <span className="avatar avatar-sm">{initialsOf("Arjun Mehta")}</span>
                <div className="stack-sm">
                  <span className="hero-mini-name">Arjun Mehta</span>
                  <span className="hero-mini-meta">Electrical · 4.9 ★</span>
                </div>
                <span className="badge-pill badge-completed">Done</span>
              </div>
            </div>
            <div className="hero-card-foot">
              <span>Avg. response time</span>
              <strong>18 minutes</strong>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Service categories</span>
            <h2 className="section-title">Find the right pro for every job</h2>
            <p className="section-subtitle">
              Standardized rates and experienced specialists ready for dispatch in your city.
            </p>
          </div>

          <div className="grid auto-grid">
            {serviceCategories.map(({ icon: Icon, name, desc, price }) => (
              <Link to={token ? "/services" : "/register"} className="category-card" key={name}>
                <span className="category-icon">
                  <Icon size={26} />
                </span>
                <h3>{name}</h3>
                <p>{desc}</p>
                <div className="category-foot">
                  <span className="category-price">From {price}</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- POPULAR SERVICES ---------------- */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Most booked</span>
            <h2 className="section-title">Popular services this month</h2>
            <p className="section-subtitle">
              Top-rated tasks our customers book again and again.
            </p>
          </div>

          <div className="grid auto-grid-wide">
            {popularServices.map((svc) => (
              <article className="service-card" key={svc.name}>
                <div className="service-card-top">
                  <span className="chip chip-accent">{svc.category}</span>
                  <span className="service-jobs">{svc.jobs}</span>
                </div>
                <h3>{svc.name}</h3>
                <p className="muted">
                  Background-checked specialist, tools included, and a workmanship guarantee.
                </p>
                <div className="service-card-foot">
                  <div>
                    <span className="service-price-label">Starting at</span>
                    <span className="price-tag">{svc.price}</span>
                  </div>
                  <Link to={token ? "/services" : "/register"} className="btn btn-sm">
                    Book now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROVIDERS ---------------- */}
      <section className="section" id="providers">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Top rated</span>
            <h2 className="section-title">Featured service providers</h2>
            <p className="section-subtitle">
              Handpicked professionals with consistent five-star feedback.
            </p>
          </div>

          <div className="grid auto-grid">
            {featuredProviders.map((prov) => (
              <article className="provider-card" key={prov.name}>
                <span className="avatar avatar-lg">{initialsOf(prov.name)}</span>
                <h3>{prov.name}</h3>
                <span className="chip">{prov.category}</span>
                <div className="provider-meta">
                  <span className="rating">
                    <Star size={15} fill="var(--accent)" /> {prov.rating}
                  </span>
                  <span className="muted">· {prov.jobs} jobs done</span>
                </div>
                {prov.verified && (
                  <span className="verified-badge">
                    <BadgeCheck size={15} /> Verified
                  </span>
                )}
                <div className="provider-foot">
                  <span className="price-tag">{prov.price}</span>
                  <Link to={token ? "/services" : "/register"} className="btn btn-sm btn-dark">
                    View profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- OFFER BANNER ---------------- */}
      <section className="section" id="offers">
        <div className="container">
          <div className="offer-banner">
            <div className="offer-copy">
              <span className="offer-tag">
                <Tag size={14} /> Limited time offer
              </span>
              <h2>Get 25% off your first deep-cleaning booking</h2>
              <p>
                Use code <strong>HOMEFRESH25</strong> at checkout. Valid on all full-home
                deep cleaning services booked this month.
              </p>
              <Link to={token ? "/services" : "/register"} className="btn btn-lg btn-dark">
                Claim the offer <ArrowRight size={16} />
              </Link>
            </div>
            <div className="offer-badge" aria-hidden="true">
              <span className="offer-badge-value">25%</span>
              <span className="offer-badge-label">OFF</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST ---------------- */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Why choose us</span>
            <h2 className="section-title">Built for trust and reliability</h2>
            <p className="section-subtitle">
              Speed, transparency and dependable service fulfillment — every single booking.
            </p>
          </div>

          <div className="grid auto-grid">
            {trustPoints.map(({ icon: Icon, title, desc }) => (
              <div className="trust-card" key={title}>
                <span className="trust-icon">
                  <Icon size={24} />
                </span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Customer stories</span>
            <h2 className="section-title">Loved by homeowners everywhere</h2>
            <p className="section-subtitle">
              Real feedback from customers who booked through the platform.
            </p>
          </div>

          <div className="grid grid-3">
            {testimonials.map((t) => (
              <article className="testimonial" key={t.name}>
                <Quote size={26} className="testimonial-quote" />
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <span className="avatar avatar-sm">{initialsOf(t.name)}</span>
                  <div className="stack-sm">
                    <strong>{t.name}</strong>
                    <span className="muted">{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <Link to="/" className="home-brand">
                <Zap size={22} fill="var(--accent)" color="var(--accent)" />
                HOME SERVICES
              </Link>
              <p>
                A modern home services platform connecting customers with verified, reliable
                professionals across the city.
              </p>
              <div className="footer-contact">
                <span>
                  <Phone size={15} /> +91 98765 43210
                </span>
                <span>
                  <Mail size={15} /> support@homeservices.example
                </span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                {serviceCategories.slice(0, 5).map((c) => (
                  <li key={c.name}>
                    <Link to={token ? "/services" : "/register"}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollTo("providers")}>
                    Become a Provider
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollTo("offers")}>
                    Offers
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollTo("testimonials")}>
                    Reviews
                  </button>
                </li>
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Get started</h4>
              <ul>
                <li className="footer-check">
                  <CheckCircle2 size={15} /> No booking fees
                </li>
                <li className="footer-check">
                  <CheckCircle2 size={15} /> Verified professionals
                </li>
                <li className="footer-check">
                  <CheckCircle2 size={15} /> Same-day availability
                </li>
              </ul>
              <Link to="/register" className="btn btn-sm">
                Create account <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Home Services Platform. All rights reserved.</span>
            <span>Reliable • Fast • Professional</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
