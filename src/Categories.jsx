import { useState, useEffect } from "react";
import { FolderTree, Pencil, Trash2 } from "lucide-react";
import Api from "./Api.jsx";

const emptyForm = {
  name: "",
  description: "",
  basePrice: "",
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/categories");
        setCategories(response.data);
      } catch {
        setError("Failed to fetch service categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refresh]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      basePrice: cat.basePrice,
    });
    setFormError("");
    window.scrollTo({ top: 0 });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        basePrice: Number(formData.basePrice),
      };

      if (editingId) {
        await Api.put(`/categories/${editingId}`, payload);
      } else {
        await Api.post("/categories", payload);
      }

      handleCancelEdit();
      setRefresh((prev) => prev + 1);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Operation failed. Please try again.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await Api.delete(`/categories/${id}`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Failed to delete category.";
        alert(msg);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Categories & Rates</h1>
          <p className="page-subtitle">
            Configure catalog offerings, category descriptions, base charges, and trade specialties.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <h3 className="card-title">
          <FolderTree size={18} />
          {editingId ? "Modify Service Category" : "Add New Category Offering"}
        </h3>

        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="category-name">Category Name *</label>
              <input
                id="category-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Masonry"
              />
            </div>

            <div className="field">
              <label htmlFor="category-price">Base Price (Rs.) *</label>
              <input
                id="category-price"
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g. 500"
              />
            </div>

            <div className="field">
              <label htmlFor="category-description">Description</label>
              <input
                id="category-description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of this trade service..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-gray">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card card-flush">
        <div className="card-head">
          <h3 className="card-title">
            <FolderTree size={18} /> Active Categories
          </h3>
          <span className="chip">{categories.length} total</span>
        </div>

        <div className="table-wrap table-wrap-flush">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Trade Description</th>
                <th>Standard Base Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No categories registered.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="cell-title">{cat.name}</td>
                    <td className="cell-muted">{cat.description || "—"}</td>
                    <td className="cell-accent">Rs. {cat.basePrice}</td>
                    <td>
                      <div className="action-row">
                        <button
                          type="button"
                          onClick={() => handleEditClick(cat)}
                          className="btn btn-sm"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
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

export default Categories;
