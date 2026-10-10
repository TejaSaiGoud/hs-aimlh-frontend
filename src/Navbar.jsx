import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  FolderTree,
  Users as UsersIcon,
  HardHat,
  Search,
  PlusCircle,
  Clock,
  Briefcase,
  LogOut,
  Zap
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header-row">
          <NavLink to="/" className="sidebar-brand">
            <Zap size={22} fill="var(--accent)" color="var(--accent)" />
            HOME SERVICES
          </NavLink>
          <button
            onClick={handleLogout}
            className="btn-danger btn-sm mobile-logout"
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {role === "ADMIN" && (
            <>
              <div className="sidebar-section-label">Overview</div>
              <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
              <div className="sidebar-section-label">Operations</div>
              <NavLink to="/admin/requests" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <ClipboardList size={18} /> Service Requests
              </NavLink>
              <NavLink to="/admin/categories" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FolderTree size={18} /> Categories
              </NavLink>
              <div className="sidebar-section-label">Management</div>
              <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <UsersIcon size={18} /> Customers
              </NavLink>
              <NavLink to="/admin/providers" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <HardHat size={18} /> Providers
              </NavLink>
            </>
          )}

          {role === "PROVIDER" && (
            <>
              <div className="sidebar-section-label">Provider Desk</div>
              <NavLink to="/provider/requests" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <Briefcase size={18} /> Service Jobs & Dispatch
              </NavLink>
            </>
          )}

          {role === "USER" && (
            <>
              <div className="sidebar-section-label">Services</div>
              <NavLink to="/services" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <Search size={18} /> Browse Services
              </NavLink>
              <NavLink to="/requests/new" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <PlusCircle size={18} /> Book a Service
              </NavLink>
              <div className="sidebar-section-label">History</div>
              <NavLink to="/my-requests" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <Clock size={18} /> My Bookings
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">{name}</span>
          <span className="sidebar-user-role">{role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn-danger btn-sm"
          title="Sign Out"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
