import { useState, useEffect } from "react";
import { Inbox, Play, CheckCircle2, MapPin, Phone } from "lucide-react";
import Api from "./Api.jsx";
import StatusBadge from "./StatusBadge.jsx";

const ProviderRequests = () => {
  const [activeTab, setActiveTab] = useState("available"); // 'available' or 'my_jobs'
  const [availableRequests, setAvailableRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        if (activeTab === "available") {
          const response = await Api.get("/provider/requests/available");
          setAvailableRequests(response.data);
        } else {
          const url =
            statusFilter === "ALL"
              ? "/provider/requests"
              : `/provider/requests?status=${statusFilter}`;
          const response = await Api.get(url);
          setAssignedRequests(response.data);
        }
      } catch {
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, statusFilter, refresh]);

  const handleAcceptJob = async (id) => {
    if (window.confirm("Do you want to accept this job? (First come, first served)")) {
      try {
        setActionMessage("");
        await Api.put(`/provider/requests/${id}/accept`);
        setActionMessage("Job successfully claimed! Check your 'My Accepted Jobs' tab.");
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to accept job. It might have already been taken.";
        alert(msg);
        setRefresh((prev) => prev + 1);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await Api.put(`/provider/requests/${id}/status?status=${newStatus}`);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to update status.";
      alert(msg);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Dispatch & Jobs</h1>
          <p className="page-subtitle">
            Accept open service calls in your trade or manage active jobs in progress.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {actionMessage && <div className="alert-success">{actionMessage}</div>}

      <div className="tab-row">
        <button
          type="button"
          className={`tab-btn ${activeTab === "available" ? "active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          Open Job Pool
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "my_jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("my_jobs")}
        >
          My Assigned Jobs
        </button>
      </div>

      <div className="card">
        {activeTab === "available" ? (
          <>
            <div className="toolbar">
              <h3 className="card-title card-title-flush">
                <Inbox size={18} /> Unclaimed Requests Matching Your Specialty
              </h3>
            </div>

            <div className="table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Title & Issue</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Requested Date</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        Searching for open service dispatches...
                      </td>
                    </tr>
                  ) : availableRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No open requests currently available in your specialty. Check back shortly!
                      </td>
                    </tr>
                  ) : (
                    availableRequests.map((req) => (
                      <tr key={req.id}>
                        <td className="cell-title">{req.title}</td>
                        <td>{req.customerName || "—"}</td>
                        <td>
                          <span className="row-inline">
                            <MapPin size={13} className="muted" /> {req.address}
                          </span>
                        </td>
                        <td>{req.preferredDate}</td>
                        <td className="cell-muted cell-desc">{req.description || "—"}</td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handleAcceptJob(req.id)}
                          >
                            Accept Job
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="toolbar">
              <div className="toolbar-group">
                <span className="toolbar-label">Filter status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter assigned jobs by status"
                >
                  <option value="ALL">All Assigned</option>
                  <option value="ASSIGNED">Assigned (Not Started)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Service Address</th>
                    <th>Scheduled</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Progress Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        Loading your assigned jobs...
                      </td>
                    </tr>
                  ) : assignedRequests.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        No assigned jobs found under this status filter.
                      </td>
                    </tr>
                  ) : (
                    assignedRequests.map((req) => (
                      <tr key={req.id}>
                        <td className="cell-title">{req.title}</td>
                        <td>{req.customerName || "—"}</td>
                        <td>
                          {req.customerPhone ? (
                            <span className="cell-accent row-inline">
                              <Phone size={13} /> {req.customerPhone}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{req.address}</td>
                        <td>{req.preferredDate}</td>
                        <td className="cell-muted cell-desc">{req.description || "—"}</td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td>
                          {req.status === "ASSIGNED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(req.id, "IN_PROGRESS")}
                              className="btn btn-sm"
                            >
                              <Play size={13} /> Start Work
                            </button>
                          )}
                          {req.status === "IN_PROGRESS" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                              className="btn btn-success btn-sm"
                            >
                              <CheckCircle2 size={13} /> Mark Completed
                            </button>
                          )}
                          {req.status !== "ASSIGNED" && req.status !== "IN_PROGRESS" && (
                            <span className="cell-dim">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderRequests;
