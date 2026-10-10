import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const ProtectedRoute = ({ roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    if (userRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (userRole === "USER") {
      return <Navigate to="/my-requests" replace />;
    } else if (userRole === "PROVIDER") {
      return <Navigate to="/provider/requests" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
