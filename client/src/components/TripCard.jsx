import { useNavigate } from "react-router-dom";
import "./TripCard.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";

  const d = new Date(dateStr);

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TripCard = ({ trip, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/trips/${trip._id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(trip);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete trip "${trip.title}"? This can't be undone.`
    );

    if (confirmed) {
      onDelete(trip._id);
    }
  };

  return (
    <article className="trip-card">
      {/* COVER IMAGE */}
      <div className="trip-card-cover">
        {trip.coverImage ? (
          <>
            <img
              src={trip.coverImage}
              alt={trip.destination || trip.title}
              className="trip-card-cover-image"
            />

            <div className="trip-card-cover-overlay">
              <b>{trip.destination}</b>
            </div>
          </>
        ) : (
          <div className="trip-card-cover-placeholder">
            <span>
              {trip.destination
                ?.slice(0, 1)
                .toUpperCase() || "T"}
            </span>

            <b>
              {trip.destination || "Destination"}
            </b>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="trip-card-body">
        <div className="trip-card-header">
          <h3>{trip.title}</h3>

          {trip.rating ? (
            <span className="trip-card-rating">
              {"★".repeat(trip.rating)}
              {"☆".repeat(5 - trip.rating)}
            </span>
          ) : (
            <span className="trip-card-rating trip-card-rating-empty">
              Not rated
            </span>
          )}
        </div>

        <p className="trip-card-dates">
          {formatDate(trip.startDate)} -{" "}
          {formatDate(trip.endDate)}
        </p>

        {trip.description && (
          <p className="trip-card-description">
            {trip.description}
          </p>
        )}

        {trip.photos?.length > 0 && (
          <div className="trip-card-photo-count">
            📷 {trip.photos.length}{" "}
            {trip.photos.length === 1
              ? "photo"
              : "photos"}
          </div>
        )}

        {/* ACTIONS */}
        <div className="trip-card-actions">
          <button
            type="button"
            className="trip-card-view"
            onClick={handleViewClick}
          >
            View Trip
          </button>

          <button
            type="button"
            className="trip-card-edit"
            onClick={handleEditClick}
          >
            Edit
          </button>

          <button
            type="button"
            className="trip-card-delete"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TripCard;