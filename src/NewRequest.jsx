import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarCheck, Clock, CheckCircle2 } from "lucide-react";
import Api from "./Api.jsx";

const TIME_SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"];

const NewRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoryId") || "";

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: initialCategory,
    title: "",
    description: "",
    address: "",
    preferredDate: "",
  });
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.get("/categories");
        setCategories(response.data);
      } catch {
        setError("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!formData.categoryId) next.categoryId = "Please select a service category.";
    if (!formData.title.trim()) next.title = "Please enter a short request title.";
    if (!formData.preferredDate) next.preferredDate = "Please choose a preferred date.";
    if (!timeSlot) next.timeSlot = "Please select a time slot.";
    if (!formData.address.trim()) next.address = "Please provide the service address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await Api.post("/user/requests", {
        ...formData,
        description: `${formData.description}${
          formData.description ? "\n" : ""
        }Preferred time slot: ${timeSlot}`,
        categoryId: Number(formData.categoryId),
      });
      navigate("/my-requests");
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to submit service request.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-requests");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Book a Service</h1>
          <p className="page-subtitle">
            Provide the details and preferred appointment slot for your home service requirement.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card booking-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="booking-category">Service Category *</label>
              <select
                id="booking-category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (Base Rs. {cat.basePrice})
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
            </div>

            <div className="field">
              <label htmlFor="booking-title">Request Title *</label>
              <input
                id="booking-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Tap leaking in kitchen"
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="field">
              <label htmlFor="booking-date">Preferred Date *</label>
              <input
                id="booking-date"
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={today}
              />
              {errors.preferredDate && <span className="field-error">{errors.preferredDate}</span>}
            </div>
          </div>

          <div className="field">
            <label>Preferred Time Slot *</label>
            <div className="slot-row">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`slot-btn ${timeSlot === slot ? "active" : ""}`}
                  onClick={() => {
                    setTimeSlot(slot);
                    setErrors((prev) => ({ ...prev, timeSlot: "" }));
                  }}
                >
                  <Clock size={14} /> {slot}
                </button>
              ))}
            </div>
            {errors.timeSlot && <span className="field-error">{errors.timeSlot}</span>}
          </div>

          <div className="field">
            <label htmlFor="booking-description">Detailed Description</label>
            <textarea
              id="booking-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what specific issues need attention or repair..."
            />
          </div>

          <div className="field">
            <label htmlFor="booking-address">Service Location Address *</label>
            <textarea
              id="booking-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="House/Apartment #, street name, landmarks, city..."
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="booking-note">
            <CheckCircle2 size={16} />
            <span>
              Your request is broadcast to verified providers in the selected category. The first
              qualified specialist to accept is dispatched.
            </span>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-lg" disabled={loading}>
              {loading ? "Submitting..." : (
                <>
                  <CalendarCheck size={17} /> Confirm & Submit Request
                </>
              )}
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-gray btn-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;