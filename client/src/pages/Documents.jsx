import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Documents.css";

const Documents = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "PASSPORT",
      title: "DUBAI",
      trip: "DUBAI 26",
      date: "8/6/2026",
      fileName: "TripVault_Week2_Task.pdf",
      notes: "WITH FRIENDS",
    },
  ]);

  const deleteDocument = (id) => {
    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== id)
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="documents-layout">
      <aside className="documents-sidebar">
        <div className="documents-logo">
          <div className="documents-logo-icon">✈</div>

          <div>
            <h2>TripVault</h2>
            <span>Your Travel Space</span>
          </div>
        </div>

        <p className="documents-menu-title">MENU</p>

        <nav className="documents-navigation">
          <button onClick={() => navigate("/dashboard")}>
            <span>⌂</span>
            Dashboard
          </button>

          <button onClick={() => navigate("/dashboard")}>
            <span>✈</span>
            My Trips
          </button>

          <button
            className="active"
            onClick={() => navigate("/documents")}
          >
            <span>▣</span>
            Documents
          </button>

          <button onClick={() => navigate("/memories")}>
            <span>◉</span>
            Memories
          </button>
        </nav>

        <div className="documents-sidebar-bottom">
          <div className="documents-profile">
            <div className="documents-avatar">
              {user.name?.slice(0, 1).toUpperCase() || "T"}
            </div>

            <div className="documents-profile-info">
              <strong>{user.name || "Traveller"}</strong>
              <span>{user.email || ""}</span>
            </div>
          </div>

          <button className="documents-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="documents-main">
        <header className="documents-topbar">
          <div>
            <h3>Documents</h3>
            <p>Manage your travel documents safely.</p>
          </div>

          <div className="documents-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search documents..."
            />
          </div>
        </header>

        <div className="documents-content">
          <section className="documents-page-header">
            <div>
              <p className="documents-eyebrow">
                TRAVEL ESSENTIALS
              </p>

              <h1>Travel Documents</h1>

              <p>
                Keep important document details organized
                for every journey.
              </p>
            </div>

            <button className="documents-add-btn">
              + Add Document
            </button>
          </section>

          <section className="documents-hero">
            <div>
              <span>YOUR DIGITAL TRAVEL FILE</span>

              <h2>
                Everything important,
                <br />
                always within reach.
              </h2>

              <p>
                Store passports, tickets, reservations and
                travel information in one safe place.
              </p>
            </div>

            <div className="documents-hero-art">▣</div>
          </section>

          <section className="documents-stats">
            <div className="documents-stat-card">
              <div className="documents-stat-icon">▣</div>

              <div>
                <span>Total Documents</span>
                <h3>{documents.length}</h3>
                <p>Stored in your vault</p>
              </div>
            </div>

            <div className="documents-stat-card">
              <div className="documents-stat-icon green">
                ✓
              </div>

              <div>
                <span>Status</span>
                <h3>Safe</h3>
                <p>Your travel records</p>
              </div>
            </div>

            <div className="documents-stat-card">
              <div className="documents-stat-icon orange">
                ✈
              </div>

              <div>
                <span>Travel Ready</span>
                <h3>Yes</h3>
                <p>Everything organized</p>
              </div>
            </div>
          </section>

          <section className="documents-section">
            <div className="documents-section-header">
              <div>
                <p>YOUR FILES</p>
                <h2>My Documents</h2>
              </div>

              <span className="documents-count">
                {documents.length} Documents
              </span>
            </div>

            <div className="documents-grid">
              {documents.map((document) => (
                <div className="document-card" key={document.id}>
                  <div className="document-card-cover">
                    <span>DOC</span>
                    <small>{document.type}</small>
                  </div>

                  <div className="document-card-body">
                    <span className="document-type">
                      {document.type}
                    </span>

                    <h3>{document.title}</h3>

                    <div className="document-details">
                      <p>
                        <strong>Trip:</strong> {document.trip}
                      </p>

                      <p>
                        <strong>Date:</strong> {document.date}
                      </p>
                    </div>

                    <div className="document-file">
                      <span>▣</span>
                      <p>{document.fileName}</p>
                    </div>

                    <p className="document-notes">
                      {document.notes}
                    </p>

                    <div className="document-card-footer">
                      <span>Stored in TripVault</span>

                      <button
                        onClick={() =>
                          deleteDocument(document.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Documents;