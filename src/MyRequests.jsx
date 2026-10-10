import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarX2, Phone, Star, Eye } from "lucide-react";
import Api from "./Api.jsx";
import StatusBadge from "./StatusBadge.jsx";

const STATUS_FILTERS = [
  { value: "ALL", label: "All Bookings" },
  { value: "PENDING", label: "Pending (Searching Provider)" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/user/requests");
        setRequests(response.data);
      } catch {
        setError("Failed to fetch your requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [refresh]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await Api.put(`/user/requests/${id}/cancel`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to cancel the request.";
        alert(msg);
      }
    }
  };

  const handleReview = (id) => {
    setReviewed((prev) => ({ ...prev, [id]: true }));
  };

  const filteredRequests =
    statusFilter === "ALL"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const hasBookings = requests.length > 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Service Bookings</h1>
          <p className="page-subtitle">
            Track current progress, assigned professionals, and past service appointments.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => navigate("/requests/new")}
          >
            New Booking
          </button>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {!loading && !hasBookings ? (
        <div className="card">
          <div className="empty-state-block">
            <CalendarX2 size={42} />
            <h3>No bookings yet</h3>
            <p>Browse our services and book your first verified professional.</p>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/requests/new")}
            >
              Book a Service
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">Filter by status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter bookings by status"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Service Title</th>
                  <th>Category</th>
                  <th>Scheduled Date</th>
                  <th>Assigned Specialist</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Loading your bookings...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No bookings found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div className="cell-title">{req.title}</div>
                        {req.description && (
                          <div className="cell-sub">{req.description}</div>
                        )}
                      </td>
                      <td className="cell-muted">{req.categoryName}</td>
                      <td>{req.preferredDate}</td>
                      <td>
                        {req.providerName ? (
                          <div>
                            <div className="cell-title">{req.providerName}</div>
                            {req.providerPhone && (
                              <div className="cell-sub">
                                <Phone size={11} /> {req.providerPhone}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="cell-dim">Awaiting Specialist</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td>
                        <div className="action-row">
                          {req.status === "PENDING" || req.status === "ASSIGNED" ? (
                            <button
                              type="button"
                              onClick={() => handleCancel(req.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Cancel
                            </button>
                          ) : req.status === "COMPLETED" ? (
                            reviewed[req.id] ? (
                              <span className="chip chip-accent">Reviewed</span>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => handleReview(req.id)}
                              >
                                <Star size={13} /> Review
                              </button>
                            )
                          ) : (
                            <button
                              type="button"
                              className="btn btn-gray btn-sm"
                              onClick={() => navigate("/services")}
                            >
                              <Eye size={13} /> Details
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;