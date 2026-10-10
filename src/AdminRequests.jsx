import { useState, useEffect } from "react";
import { Search, MapPin, Phone, Trash2 } from "lucide-react";
import Api from "./Api.jsx";
import StatusBadge from "./StatusBadge.jsx";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProviders, setSelectedProviders] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reqsRes, provsRes] = await Promise.all([
          Api.get("/admin/requests"),
          Api.get("/admin/providers"),
        ]);
        setRequests(reqsRes.data);
        setProviders(provsRes.data);
      } catch {
        setError("Failed to fetch requests or providers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleProviderSelectChange = (requestId, providerId) => {
    setSelectedProviders((prev) => ({
      ...prev,
      [requestId]: providerId,
    }));
  };

  const handleAssign = async (requestId) => {
    const providerId = selectedProviders[requestId];
    if (!providerId) {
      alert("Please select a provider first.");
      return;
    }

    try {
      await Api.put(`/admin/requests/${requestId}/assign?providerId=${providerId}`);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to assign provider.";
      alert(msg);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await Api.put(`/admin/requests/${id}/cancel`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to cancel request.";
        alert(msg);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request permanently?")) {
      try {
        await Api.delete(`/admin/requests/${id}`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to delete request.";
        alert(msg);
      }
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (req.title && req.title.toLowerCase().includes(term)) ||
      (req.customerName && req.customerName.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Bookings Management</h1>
          <p className="page-subtitle">
            Monitor platform booking dispatches, manual assignments, cancellations, and status histories.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search">
            <div className="input-with-icon">
              <span className="field-icon">
                <Search size={17} />
              </span>
              <input
                type="text"
                placeholder="Search by title or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search bookings"
              />
            </div>
          </div>

          <div className="toolbar-group">
            <span className="toolbar-label">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter bookings by status"
            >
              <option value="ALL">All Requests</option>
              <option value="PENDING">Pending (Unassigned)</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title & Address</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Date</th>
                <th>Assigned Specialist</th>
                <th>Status</th>
                <th>Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    Loading service bookings...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No requests found matching your query.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const categoryProviders = providers.filter(
                    (p) => p.categoryId === req.categoryId
                  );

                  const canAssign =
                    req.status === "PENDING" || req.status === "ASSIGNED";
                  const canCancel =
                    req.status !== "COMPLETED" && req.status !== "CANCELLED";

                  return (
                    <tr key={req.id}>
                      <td>
                        <div className="cell-title">{req.title}</div>
                        {req.address && (
                          <div className="cell-sub">
                            <MapPin size={11} /> {req.address}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="cell-title">{req.customerName || "—"}</div>
                        {req.customerPhone && (
                          <div className="cell-sub">{req.customerPhone}</div>
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
                          <span className="cell-dim">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td>
                        <div className="action-row">
                          {canAssign && (
                            <>
                              <select
                                className="select-compact"
                                value={selectedProviders[req.id] || ""}
                                onChange={(e) =>
                                  handleProviderSelectChange(req.id, e.target.value)
                                }
                                aria-label="Select a specialist to assign"
                              >
                                <option value="">Select Specialist</option>
                                {categoryProviders.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => handleAssign(req.id)}
                                className="btn btn-sm"
                              >
                                Assign
                              </button>
                            </>
                          )}

                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => handleCancel(req.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(req.id)}
                            className="btn btn-gray btn-sm"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;
