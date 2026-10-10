import { useState, useEffect } from "react";
import { Users as UsersIcon, Trash2 } from "lucide-react";
import Api from "./Api.jsx";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/admin/users");
        setUsers(response.data);
      } catch {
        setError("Failed to fetch customer accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer account?")) {
      try {
        await Api.delete(`/admin/users/${id}`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to delete user.";
        alert(msg);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Accounts</h1>
          <p className="page-subtitle">
            Manage registered platform users, view contact directories, and remove inactive accounts.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card card-flush">
        <div className="card-head">
          <h3 className="card-title">
            <UsersIcon size={18} /> Registered Customers
          </h3>
          <span className="chip">{users.length} total</span>
        </div>

        <div className="table-wrap table-wrap-flush">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Service Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No registered customer accounts found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="cell-title">{user.name}</td>
                    <td className="cell-muted">{user.email}</td>
                    <td>{user.phone || "—"}</td>
                    <td className="cell-muted">{user.address || "—"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
