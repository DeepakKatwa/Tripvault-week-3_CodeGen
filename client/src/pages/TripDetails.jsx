import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTripById } from "../services/tripService";
import "./TripDetails.css";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchTripById(id);

        setTrip(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load trip details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="trip-details-status">
        <div className="trip-details-loader">✈</div>

        <h2>Loading your journey...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-details-status">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="trip-details-page">

      {/* BACK BUTTON */}

      <button
        className="trip-details-back"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* COVER */}

      <section className="trip-details-hero">

        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.destination}
          />
        ) : (
          <div className="trip-details-placeholder">
            ✈
          </div>
        )}

        <div className="trip-details-overlay">

          <p>YOUR JOURNEY</p>

          <h1>{trip.title}</h1>

          <span>
            📍 {trip.destination}
          </span>

        </div>

      </section>

      {/* INFORMATION */}

      <section className="trip-details-content">

        <div className="trip-info-card">

          <div className="trip-info-heading">

            <div>
              <p>TRIP DETAILS</p>
              <h2>{trip.title}</h2>
            </div>

            {trip.rating ? (
              <div className="trip-details-rating">
                {"★".repeat(trip.rating)}
                {"☆".repeat(5 - trip.rating)}
              </div>
            ) : (
              <div className="trip-details-rating-empty">
                Not rated
              </div>
            )}

          </div>

          <div className="trip-details-info-grid">

            <div className="trip-detail-box">
              <span>Destination</span>
              <strong>{trip.destination}</strong>
            </div>

            <div className="trip-detail-box">
              <span>Start Date</span>
              <strong>
                {formatDate(trip.startDate)}
              </strong>
            </div>

            <div className="trip-detail-box">
              <span>End Date</span>
              <strong>
                {formatDate(trip.endDate)}
              </strong>
            </div>

            <div className="trip-detail-box">
              <span>Photos</span>
              <strong>
                {trip.photos?.length || 0}
              </strong>
            </div>

          </div>

          {trip.description && (
            <div className="trip-details-description">

              <p>ABOUT THIS JOURNEY</p>

              <div>
                {trip.description}
              </div>

            </div>
          )}

        </div>

        {/* WEEK 3 PHOTO GALLERY */}

        <div className="trip-gallery-section">

          <div className="trip-gallery-heading">

            <div>
              <p>TRAVEL MEMORIES</p>
              <h2>Photo Gallery</h2>
            </div>

            <span>
              {trip.photos?.length || 0}{" "}
              {trip.photos?.length === 1
                ? "photo"
                : "photos"}
            </span>

          </div>

          {trip.photos?.length > 0 ? (
            <div className="trip-photo-grid">

              {trip.photos.map((photo, index) => (

                <div
                  className="trip-photo-item"
                  key={`${photo}-${index}`}
                >
                  <img
                    src={photo}
                    alt={`${trip.title} ${index + 1}`}
                  />

                  <div className="trip-photo-number">
                    Photo {index + 1}
                  </div>
                </div>

              ))}

            </div>
          ) : (
            <div className="trip-gallery-empty">

              <div>📷</div>

              <h3>No photos yet</h3>

              <p>
                Add photos to this trip to build your
                travel gallery.
              </p>

            </div>
          )}

        </div>

      </section>

    </div>
  );
};

export default TripDetails;