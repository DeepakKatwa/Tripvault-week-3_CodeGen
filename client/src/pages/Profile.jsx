import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "./Profile.css";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/users/${username}/profile`
        );

        setProfile(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="profile-status">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-status">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="public-profile-page">
      <section className="public-profile-header">
        <div className="public-profile-avatar">
          {profile.user.name
            ?.slice(0, 1)
            .toUpperCase() || "T"}
        </div>

        <div>
          <p className="profile-label">
            TRIPVAULT TRAVELLER
          </p>

          <h1>{profile.user.name}</h1>

          <span className="profile-username">
            @{profile.user.username}
          </span>

          <p className="profile-bio">
            {profile.user.bio ||
              "This traveller has not added a bio yet."}
          </p>
        </div>
      </section>

      <section className="public-profile-trips">
        <div className="profile-section-heading">
          <div>
            <p>PUBLIC JOURNEYS</p>
            <h2>Trips</h2>
          </div>

          <span>
            {profile.trips.length}{" "}
            {profile.trips.length === 1
              ? "trip"
              : "trips"}
          </span>
        </div>

        {profile.trips.length === 0 ? (
          <div className="profile-empty">
            <div>✈</div>

            <h3>No trips yet</h3>

            <p>
              This traveller has not shared any
              journeys yet.
            </p>
          </div>
        ) : (
          <div className="public-trip-grid">
            {profile.trips.map((trip) => (
              <article
                key={trip._id}
                className="public-trip-card"
              >
                <div className="public-trip-cover">
                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage}
                      alt={
                        trip.destination ||
                        trip.title
                      }
                    />
                  ) : (
                    <div className="public-trip-placeholder">
                      {trip.destination
                        ?.slice(0, 1)
                        .toUpperCase() || "T"}
                    </div>
                  )}

                  <div className="public-trip-destination">
                    {trip.destination}
                  </div>
                </div>

                <div className="public-trip-body">
                  <div className="public-trip-title-row">
                    <h3>{trip.title}</h3>

                    {trip.rating ? (
                      <span>
                        {"★".repeat(
                          trip.rating
                        )}
                      </span>
                    ) : null}
                  </div>

                  <p>
                    {formatDate(
                      trip.startDate
                    )}{" "}
                    -{" "}
                    {formatDate(
                      trip.endDate
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}