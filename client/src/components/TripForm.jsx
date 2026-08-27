import { useState, useEffect } from 'react';
import './TripForm.css';

const emptyTrip = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  description: '',
  rating: '',
};

// Props:
// initialData  -> trip object when editing, null/undefined when creating
// onSubmit     -> function(formData) called on save
// onCancel     -> function() called to close the form
const TripForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(emptyTrip);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        destination: initialData.destination || '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : '',
        description: initialData.description || '',
        rating: initialData.rating || '',
      });
    } else {
      setFormData(emptyTrip);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.endDate < formData.startDate) {
      setError('End date cannot be before start date.');
      return;
    }
    setSaving(true);
    try {
      const result = await onSubmit({
        ...formData,
        rating: formData.rating ? Number(formData.rating) : undefined,
      });
      if (result?.error) setError(result.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trip-form-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="trip-form-modal" role="dialog" aria-modal="true">
        <h2>{initialData ? 'Edit Trip' : 'Create Trip'}</h2>
        <p className="trip-form-intro">Add the details of your journey below.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength="100"
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
            />
          </label>

          <div className="trip-form-actions">
            <button type="button" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : initialData ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
