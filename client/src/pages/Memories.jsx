import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Memories.css";

const Memories = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    trip: "",
    date: "",
    location: "",
    story: "",
    photoName: "",
    photoPreview: "",
  });

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    try {
      const stored =
        localStorage.getItem("tripvault_memories") ||
        localStorage.getItem("memories");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setMemories(parsed);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveMemories = (items) => {
    setMemories(items);

    localStorage.setItem(
      "tripvault_memories",
      JSON.stringify(items)
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        photoName: file.name,
        photoPreview: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const closeForm = () => {
    setShowForm(false);

    setForm({
      title: "",
      trip: "",
      date: "",
      location: "",
      story: "",
      photoName: "",
      photoPreview: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter memory title.");
      return;
    }

    const newMemory = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    saveMemories([
      newMemory,
      ...memories,
    ]);

    closeForm();
  };

  const deleteMemory = (id) => {
    if (
      !window.confirm(
        "Delete this memory?"
      )
    ) {
      return;
    }

    saveMemories(
      memories.filter(
        (memory) =>
          (memory.id || memory._id) !== id
      )
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const filteredMemories = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return memories;
    }

    return memories.filter((memory) =>
      [
        memory.title,
        memory.trip,
        memory.location,
        memory.story,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [memories, search]);

  const firstLetter =
    user.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "T";

  return (
    <div className="memories-layout">

      <aside className="memories-sidebar">

        <div className="memories-logo">

          <div className="memories-logo-icon">
            ✈
          </div>

          <div>
            <h2>TripVault</h2>
            <span>Your Travel Space</span>
          </div>

        </div>

        <p className="memories-menu-title">
          MENU
        </p>

        <nav className="memories-navigation">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>✈</span>
            My Trips
          </button>

          <button
            onClick={() =>
              navigate("/documents")
            }
          >
            <span>▣</span>
            Documents
          </button>

          <button
            className="active"
            onClick={() =>
              navigate("/memories")
            }
          >
            <span>◉</span>
            Memories
          </button>

        </nav>

        <div className="memories-sidebar-bottom">

          <div className="memories-profile">

            <div className="memories-avatar">
              {firstLetter}
            </div>

            <div className="memories-profile-info">

              <strong>
                {user.name || "Traveller"}
              </strong>

              <span>{user.email}</span>

            </div>

          </div>

          <button
            className="memories-logout"
            onClick={logout}
          >
            ↪ Log out
          </button>

        </div>

      </aside>

      <main className="memories-main">

        <header className="memories-topbar">

          <div>
            <h3>Memories</h3>

            <p>
              Keep your favorite travel
              moments forever.
            </p>
          </div>

          <div className="memories-top-actions">

            <div className="memories-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search memories..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="memories-top-avatar">
              {firstLetter}
            </div>

          </div>

        </header>

        <div className="memories-content">

          <section className="memories-page-header">

            <div>

              <p className="memories-eyebrow">
                YOUR STORY
              </p>

              <h1>Travel Memories</h1>

              <p>
                Save the photos, places and
                stories you never want to
                forget.
              </p>

            </div>

            <button
              className="memories-add-btn"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Add Memory
            </button>

          </section>

          <section className="memories-hero">

            <div>

              <span>
                MOMENTS BECOME STORIES
              </span>

              <h2>
                Your journeys deserve
                to be remembered.
              </h2>

              <p>
                Turn every special travel moment
                into a story and create your own
                personal collection of adventures.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
              >
                Capture a memory →
              </button>

            </div>

            <div className="memories-hero-art">
              ◉
            </div>

          </section>

          <section className="memories-stats">

            <div className="memory-stat-card">
              <div>◉</div>

              <span>
                <small>MEMORIES</small>
                <strong>
                  {memories.length}
                </strong>
                <p>Moments captured</p>
              </span>
            </div>

            <div className="memory-stat-card">
              <div>✈</div>

              <span>
                <small>STORIES</small>
                <strong>
                  {memories.length}
                </strong>
                <p>Travel experiences</p>
              </span>
            </div>

            <div className="memory-stat-card">
              <div>♡</div>

              <span>
                <small>YOUR VAULT</small>
                <strong>Forever</strong>
                <p>Moments worth keeping</p>
              </span>
            </div>

          </section>

          <section className="memories-section">

            <div className="memories-section-header">

              <div>
                <p>YOUR COLLECTION</p>
                <h2>My Memories</h2>
              </div>

              <span>
                {filteredMemories.length}{" "}
                {filteredMemories.length === 1
                  ? "memory"
                  : "memories"}
              </span>

            </div>

            {memories.length === 0 ? (

              <div className="memories-empty">

                <div>
                  ◉
                </div>

                <p className="memory-empty-label">
                  YOUR STORY STARTS HERE
                </p>

                <h3>
                  No memories added yet
                </h3>

                <p>
                  Add a photo and write the story
                  behind your favorite travel
                  moment.
                </p>

                <button
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  + Add Your First Memory
                </button>

              </div>

            ) : filteredMemories.length === 0 ? (

              <div className="memories-empty">

                <div>⌕</div>

                <h3>
                  No memories found
                </h3>

                <p>
                  No memories match "{search}".
                </p>

                <button
                  onClick={() =>
                    setSearch("")
                  }
                >
                  Clear Search
                </button>

              </div>

            ) : (

              <div className="memories-grid">

                {filteredMemories.map(
                  (memory) => {

                    const id =
                      memory.id ||
                      memory._id;

                    return (
                      <article
                        className="memory-card"
                        key={id}
                      >

                        <div className="memory-photo">

                          {memory.photoPreview ||
                          memory.image ||
                          memory.photo ? (

                            <img
                              src={
                                memory.photoPreview ||
                                memory.image ||
                                memory.photo
                              }
                              alt={
                                memory.title
                              }
                            />

                          ) : (

                            <div className="memory-placeholder">
                              <span>◉</span>
                              <small>
                                TRAVEL MEMORY
                              </small>
                            </div>

                          )}

                          {memory.location && (
                            <span className="memory-location">
                              ● {memory.location}
                            </span>
                          )}

                        </div>

                        <div className="memory-body">

                          <span className="memory-category">
                            MEMORY
                          </span>

                          <h3>
                            {memory.title ||
                              "Travel Memory"}
                          </h3>

                          {memory.trip && (
                            <p className="memory-trip">
                              ✈ {memory.trip}
                            </p>
                          )}

                          {memory.story && (
                            <p className="memory-story">
                              {memory.story}
                            </p>
                          )}

                          <div className="memory-footer">

                            <span>
                              {memory.date ||
                                "Special moment"}
                            </span>

                            <button
                              onClick={() =>
                                deleteMemory(id)
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

          </section>

        </div>

      </main>

      {showForm && (

        <div
          className="memories-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >

          <form
            className="memories-modal"
            onSubmit={handleSubmit}
          >

            <div className="memories-modal-header">

              <div>
                <p>NEW STORY</p>
                <h2>Add Memory</h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
              >
                ×
              </button>

            </div>

            <div className="memories-form">

              <label>
                Memory Title

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Sunset at Goa"
                />
              </label>

              <div className="memory-form-row">

                <label>
                  Trip

                  <input
                    name="trip"
                    value={form.trip}
                    onChange={handleChange}
                    placeholder="Goa Trip"
                  />
                </label>

                <label>
                  Date

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </label>

              </div>

              <label>
                Location

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Goa, India"
                />
              </label>

              <label>
                Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                />
              </label>

              {form.photoPreview && (
                <img
                  className="memory-preview"
                  src={form.photoPreview}
                  alt="Preview"
                />
              )}

              <label>
                Your Story

                <textarea
                  name="story"
                  value={form.story}
                  onChange={handleChange}
                  placeholder="Write the story behind this moment..."
                />
              </label>

            </div>

            <div className="memories-modal-footer">

              <button
                type="button"
                className="memory-cancel"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="memory-save"
              >
                Save Memory
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
};

export default Memories;