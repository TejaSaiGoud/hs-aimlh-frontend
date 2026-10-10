import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  UserCheck,
  Loader,
  CheckCircle2,
  XCircle,
  Users as UsersIcon,
  HardHat,
} from "lucide-react";
import Api from "./Api.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, requestsRes] = await Promise.all([
          Api.get("/admin/dashboard/stats"),
          Api.get("/admin/requests?status=PENDING"),
        ]);
        setStats(statsRes.data);
        setPendingRequests(requestsRes.data);
      } catch {
        setError("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Bookings", value: stats.totalRequests, Icon: ClipboardList },
        { label: "Pending Claims", value: stats.pending, Icon: Clock },
        { label: "Assigned", value: stats.assigned, Icon: UserCheck },
        { label: "In Progress", value: stats.inProgress, Icon: Loader },
        { label: "Completed", value: stats.completed, Icon: CheckCircle2 },
        { label: "Cancelled", value: stats.cancelled, Icon: XCircle },
        { label: "Total Customers", value: stats.totalUsers, Icon: UsersIcon },
        { label: "Service Providers", value: stats.totalProviders, Icon: HardHat },
      ]
    : [];

  const chartData = stats
    ? [
        { label: "Pending", value: stats.pending },
        { label: "Assigned", value: stats.assigned },
        { label: "In Progress", value: stats.inProgress },
        { label: "Completed", value: stats.completed },
        { label: "Cancelled", value: stats.cancelled },
      ]
    : [];
  const chartMax = Math.max(1, ...chartData.map((d) => d.value));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            System activity overview, request volumes, provider coverage, and service pipeline.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => navigate("/admin/requests")}
          >
            View All Requests
          </button>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading-block">Loading dashboard metrics...</div>
      ) : (
        <>
          <div className="stat-grid">
            {statCards.map(({ label, value, Icon }) => (
              <div key={label} className="stat-card">
                <span className="stat-icon">
                  <Icon size={19} />
                </span>
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="card-title">Booking Pipeline Breakdown</h3>
            <div className="chart">
              {chartData.map((d) => (
                <div className="chart-col" key={d.label}>
                  <span className="chart-value">{d.value}</span>
                  <div className="chart-track">
                    <div
                      className="chart-bar"
                      style={{ height: `${(d.value / chartMax) * 100}%` }}
                    />
                  </div>
                  <span className="chart-label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="toolbar">
              <h3 className="card-title card-title-flush">
                Unclaimed Service Requests (Awaiting Provider Acceptance)
              </h3>
              <button
                type="button"
                className="btn btn-gray btn-sm"
                onClick={() => navigate("/admin/requests")}
              >
                Manage All
              </button>
            </div>

            <div className="table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Service Title</th>
                    <th>Customer Name</th>
                    <th>Service Category</th>
                    <th>Requested Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No pending requests in the dispatch queue.
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.slice(0, 5).map((req) => (
                      <tr key={req.id}>
                        <td className="cell-title">{req.title}</td>
                        <td>{req.customerName || "—"}</td>
                        <td className="cell-muted">{req.categoryName}</td>
                        <td>{req.preferredDate}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => navigate("/admin/requests")}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
