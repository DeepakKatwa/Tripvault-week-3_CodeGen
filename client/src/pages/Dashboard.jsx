import { useState, useEffect } from "react";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import {
  fetchTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../services/tripService";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [search, setSearch] = useState("");

  const loadTrips = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchTrips();
      setTrips(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load trips. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const openCreateForm = () => {
    setEditingTrip(null);
    setShowForm(true);
  };

  const openEditForm = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTrip) {
        await updateTrip(editingTrip._id, formData);
      } else {
        await createTrip(formData);
      }

      closeForm();
      await loadTrips();

      return { success: true };
    } catch (err) {
      return {
        error:
          err.response?.data?.message ||
          "Something went wrong saving the trip.",
      };
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      await loadTrips();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete trip."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const filteredTrips = trips.filter((trip) => {
    const keyword = search.toLowerCase();

    return (
      trip.title?.toLowerCase().includes(keyword) ||
      trip.destination?.toLowerCase().includes(keyword) ||
      trip.location?.toLowerCase().includes(keyword)
    );
  });

  const upcomingTrips = trips.filter((trip) => {
    if (!trip.startDate) return false;

    return new Date(trip.startDate) >= new Date();
  });

  const firstName =
    user.name?.split(" ")[0] || "Traveller";

  return (
    <div className="tripvault-layout">

      {/* SIDEBAR */}
      <aside className="tripvault-sidebar">

        <div className="tripvault-logo">
          <div className="tripvault-logo-icon">
            ✈
          </div>

          <div>
            <h2>TripVault</h2>
            <span>Your Travel Space</span>
          </div>
        </div>

        <p className="sidebar-label">MENU</p>

        <nav className="tripvault-nav">

          <button
            className="nav-item active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span className="nav-icon">✈</span>
            My Trips
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/documents")
            }
          >
            <span className="nav-icon">▣</span>
            Documents
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/memories")
            }
          >
            <span className="nav-icon">◉</span>
            Memories
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-profile">

            <div className="profile-avatar">
              {user.name?.slice(0, 1).toUpperCase() ||
                "T"}
            </div>

            <div className="profile-info">
              <strong>
                {user.name || "Traveller"}
              </strong>

              <span>{user.email}</span>
            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}
      <main className="tripvault-main">

        {/* TOP HEADER */}
        <header className="tripvault-topbar">

          <div>
            <h3>Travel Dashboard</h3>

            <p>
              Plan, organize and remember every
              journey.
            </p>
          </div>

          <div className="topbar-actions">

            <div className="dashboard-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search trips..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button className="notification-btn">
              ♢
              <span></span>
            </button>

            <div className="top-profile">
              <div className="top-profile-avatar">
                {user.name?.slice(0, 1).toUpperCase() ||
                  "T"}
              </div>

              <div>
                <strong>{firstName}</strong>
                <span>Traveller</span>
              </div>
            </div>

          </div>

        </header>

        <div className="tripvault-content">

          {/* WELCOME SECTION */}
          <section className="welcome-section">

            <div>
              <p className="welcome-label">
                WELCOME TO YOUR VAULT
              </p>

              <h1>
                Ready for your next
                <span> adventure?</span>
              </h1>

              <p className="welcome-text">
                Hello {firstName}, keep your
                journeys, documents and memories
                organized in one place.
              </p>
            </div>

            <button
              className="new-trip-btn"
              onClick={openCreateForm}
            >
              <span>＋</span>
              Create New Trip
            </button>

          </section>

          {/* HERO */}
          <section className="travel-hero">

            <div className="hero-decoration hero-circle-one">
            </div>

            <div className="hero-decoration hero-circle-two">
            </div>

            <div className="hero-left">

              <div className="hero-tag">
                ✦ EXPLORE • DISCOVER • REMEMBER
              </div>

              <h2>
                Turn every journey into a story.
              </h2>

              <p>
                Your personal travel vault for
                planning destinations, storing
                documents and saving unforgettable
                memories.
              </p>

              <button
                onClick={openCreateForm}
                className="hero-button"
              >
                Start Planning
                <span>→</span>
              </button>

            </div>

            <div className="hero-art">

              <div className="hero-globe">
                ◎
              </div>

              <div className="hero-plane">
                ✈
              </div>

              <div className="hero-location">
                ●
              </div>

            </div>

          </section>

          {/* STATS */}
          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon blue">
                ✈
              </div>

              <div>
                <span>Total Trips</span>

                <h3>{trips.length}</h3>

                <p>Journeys in your vault</p>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                ◈
              </div>

              <div>
                <span>Upcoming</span>

                <h3>{upcomingTrips.length}</h3>

                <p>Adventures waiting</p>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                ▣
              </div>

              <div>
                <span>Documents</span>

                <h3>Safe</h3>

                <p>Travel files organized</p>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon purple">
                ◉
              </div>

              <div>
                <span>Memories</span>

                <h3>∞</h3>

                <p>Moments worth keeping</p>
              </div>

            </div>

          </section>

          {/* SECTION HEADER */}
          <section className="trips-section">

            <div className="section-heading">

              <div>
                <p>YOUR JOURNEYS</p>

                <h2>My Trips</h2>
              </div>

              <div className="section-actions">

                <span>
                  {filteredTrips.length}{" "}
                  {filteredTrips.length === 1
                    ? "trip"
                    : "trips"}
                </span>

                <button
                  onClick={openCreateForm}
                  className="section-add-btn"
                >
                  + Add Trip
                </button>

              </div>

            </div>

            {/* LOADING */}
            {loading && (
              <div className="dashboard-loading">

                <div className="loading-plane">
                  ✈
                </div>

                <h3>Opening your travel vault...</h3>

                <p>
                  Loading your journeys.
                </p>

              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="dashboard-error-box">

                <div>!</div>

                <h3>
                  We couldn't load your trips
                </h3>

                <p>{error}</p>

                <button onClick={loadTrips}>
                  Try Again
                </button>

              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              trips.length === 0 && (

                <div className="dashboard-empty">

                  <div className="empty-plane">
                    ✈
                  </div>

                  <p className="empty-label">
                    YOUR STORY STARTS HERE
                  </p>

                  <h2>
                    Your travel vault is empty
                  </h2>

                  <p>
                    Create your first journey and
                    start collecting destinations,
                    memories and adventures.
                  </p>

                  <button
                    className="empty-create-btn"
                    onClick={openCreateForm}
                  >
                    + Create Your First Trip
                  </button>

                </div>

              )}

            {/* SEARCH EMPTY */}
            {!loading &&
              !error &&
              trips.length > 0 &&
              filteredTrips.length === 0 && (

                <div className="search-empty">

                  <div>⌕</div>

                  <h3>No trips found</h3>

                  <p>
                    No journey matches
                    "{search}".
                  </p>

                  <button
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    Clear Search
                  </button>

                </div>

              )}

            {/* TRIPS */}
            {!loading &&
              !error &&
              filteredTrips.length > 0 && (

                <div className="dashboard-trip-grid">

                  {filteredTrips.map((trip) => (

                    <TripCard
                      key={trip._id}
                      trip={trip}
                      onEdit={openEditForm}
                      onDelete={handleDelete}
                    />

                  ))}

                </div>

              )}

          </section>

          {/* QUICK ACTION AREA */}
          <section className="quick-actions-section">

            <div className="quick-heading">

              <p>QUICK ACCESS</p>

              <h2>
                Everything for your journey
              </h2>

            </div>

            <div className="quick-cards">

              <button
                className="quick-card"
                onClick={openCreateForm}
              >

                <div className="quick-card-icon">
                  ✈
                </div>

                <div>
                  <strong>
                    Plan a Trip
                  </strong>

                  <span>
                    Create your next adventure
                  </span>
                </div>

                <b>→</b>

              </button>

              <button
                className="quick-card"
                onClick={() =>
                  navigate("/documents")
                }
              >

                <div className="quick-card-icon">
                  ▣
                </div>

                <div>
                  <strong>
                    Travel Documents
                  </strong>

                  <span>
                    Keep important files safe
                  </span>
                </div>

                <b>→</b>

              </button>

              <button
                className="quick-card"
                onClick={() =>
                  navigate("/memories")
                }
              >

                <div className="quick-card-icon">
                  ◉
                </div>

                <div>
                  <strong>
                    Travel Memories
                  </strong>

                  <span>
                    Preserve special moments
                  </span>
                </div>

                <b>→</b>

              </button>

            </div>

          </section>

        </div>

        {/* CREATE / EDIT MODAL */}
        {showForm && (
          <TripForm
            initialData={editingTrip}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}

      </main>

    </div>
  );
};

export default Dashboard;