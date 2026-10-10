import { useState, useEffect } from "react";
import { BadgeCheck, Trash2 } from "lucide-react";
import Api from "./Api.jsx";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  categoryId: "",
};

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provsRes, catsRes] = await Promise.all([
          Api.get("/admin/providers"),
          Api.get("/categories"),
        ]);
        setProviders(provsRes.data);
        setCategories(catsRes.data);
      } catch {
        setError("Failed to fetch providers or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      await Api.post("/admin/providers", {
        ...formData,
        categoryId: Number(formData.categoryId),
      });
      setFormData(emptyForm);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to create provider.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this provider account?")) {
      try {
        await Api.delete(`/admin/providers/${id}`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to delete provider.";
        alert(msg);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Providers Directory</h1>
          <p className="page-subtitle">
            Manage certified tradespeople, onboarding records, category assignments, and credentials.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <h3 className="card-title">
          <BadgeCheck size={18} /> Register New Service Specialist
        </h3>

        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="provider-name">Full Name *</label>
              <input
                id="provider-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Carpenter"
              />
            </div>

            <div className="field">
              <label htmlFor="provider-email">Email Address *</label>
              <input
                id="provider-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="specialist@service.com"
              />
            </div>

            <div className="field">
              <label htmlFor="provider-password">Temporary Password *</label>
              <input
                id="provider-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label htmlFor="provider-phone">Phone Number</label>
              <input
                id="provider-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            <div className="field">
              <label htmlFor="provider-category">Assigned Specialty *</label>
              <select
                id="provider-category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? "Adding..." : "Add Specialist Account"}
          </button>
        </form>
      </div>

      <div className="card card-flush">
        <div className="card-head">
          <h3 className="card-title">
            <BadgeCheck size={18} /> Certified Specialists
          </h3>
          <span className="chip">{providers.length} total</span>
        </div>

        <div className="table-wrap table-wrap-flush">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Specialist Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Specialty Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Loading providers...
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No service specialists registered yet.
                  </td>
                </tr>
              ) : (
                providers.map((prov) => (
                  <tr key={prov.id}>
                    <td className="cell-title">{prov.name}</td>
                    <td className="cell-muted">{prov.email}</td>
                    <td>{prov.phone || "—"}</td>
                    <td>
                      <span className="chip chip-accent">{prov.categoryName || "—"}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(prov.id)}
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

export default Providers;
