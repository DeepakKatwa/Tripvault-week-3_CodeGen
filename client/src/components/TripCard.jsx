import './TripCard.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Props:
// trip     -> the trip object
// onEdit   -> function(trip) called when card is clicked
// onDelete -> function(tripId) called when delete button is clicked
const TripCard = ({ trip, onEdit, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // don't trigger onEdit when clicking delete
    const confirmed = window.confirm(`Delete trip "${trip.title}"? This can't be undone.`);
    if (confirmed) {
      onDelete(trip._id);
    }
  };

  return (
    <article className="trip-card">
      <div className="trip-card-cover"><span>{trip.destination?.slice(0, 1).toUpperCase()}</span><b>{trip.destination}</b></div>
      <div className="trip-card-body">
      <div className="trip-card-header">
        <h3>{trip.title}</h3>
        {trip.rating ? (
          <span className="trip-card-rating">{'★'.repeat(trip.rating)}{'☆'.repeat(5 - trip.rating)}</span>
        ) : (
          <span className="trip-card-rating trip-card-rating-empty">Not rated</span>
        )}
      </div>

      <p className="trip-card-dates">
        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
      </p>

      {trip.description && <p className="trip-card-description">{trip.description}</p>}

      <div className="trip-card-actions">
        <button className="trip-card-edit" onClick={() => onEdit(trip)}>Edit trip</button>
        <button className="trip-card-delete" onClick={handleDeleteClick}>Delete</button>
      </div>
      </div>
    </article>
  );
};

export default TripCard;
