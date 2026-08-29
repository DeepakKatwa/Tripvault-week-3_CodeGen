import { useEffect, useState } from "react";
import "./TripForm.css";

const emptyTrip = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
  rating: "",
};

const TripForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(emptyTrip);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        destination: initialData.destination || "",
        startDate: initialData.startDate
          ? initialData.startDate.slice(0, 10)
          : "",
        endDate: initialData.endDate
          ? initialData.endDate.slice(0, 10)
          : "",
        description: initialData.description || "",
        rating: initialData.rating || "",
      });

      setImagePreview(initialData.coverImage || "");
    } else {
      setFormData(emptyTrip);
      setImagePreview("");
    }

    setImageFile(null);
    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    setSaving(true);

    try {
      const result = await onSubmit({
        tripData: {
          ...formData,
          rating: formData.rating
            ? Number(formData.rating)
            : undefined,
        },
        imageFile,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Something went wrong while saving the trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="trip-form-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onCancel();
        }
      }}
    >
      <div
        className="trip-form-modal"
        role="dialog"
        aria-modal="true"
      >
        <h2>
          {initialData ? "Edit Trip" : "Create Trip"}
        </h2>

        <p className="trip-form-intro">
          Add the details of your journey below.
        </p>

        {error && (
          <div className="form-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength="100"
              placeholder="Enter trip title"
              required
            />
          </label>

          <label>
            Destination
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              maxLength="100"
              placeholder="Enter destination"
              required
            />
          </label>

          <div className="trip-form-row">
            <label>
              Start Date
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                required
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              maxLength="1000"
              placeholder="Write something about this trip"
            />
          </label>

          <label>
            Rating (1-5)
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              placeholder="1 to 5"
            />
          </label>

          <label>
            Trip Photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
          </label>

          <p className="trip-image-help">
            JPG, PNG or WEBP. Maximum size: 5 MB.
          </p>

          {imagePreview && (
            <div className="trip-image-preview">
              <img
                src={imagePreview}
                alt="Trip preview"
              />
            </div>
          )}

          <div className="trip-form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : initialData
                ? "Save Changes"
                : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;