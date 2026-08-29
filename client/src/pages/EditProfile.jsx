import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setForm({
        name: savedUser.name || "",
        username: savedUser.username || "",
        bio: savedUser.bio || "",
      });
    } catch (err) {
      console.error("Failed to read user:", err);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        username: form.username
          .trim()
          .toLowerCase(),
        bio: form.bio.trim(),
      };

      const { data } = await api.put(
        "/users/profile",
        payload
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setSuccess(
        "Profile updated successfully"
      );

      setTimeout(() => {
        navigate(
          `/profile/${data.user.username}`
        );
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="edit-profile-page">
      <section className="edit-profile-card">
        <button
          type="button"
          className="edit-profile-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="edit-profile-heading">
          <p>TRIPVAULT PROFILE</p>

          <h1>Edit Profile</h1>

          <span>
            Update your public traveller profile.
          </span>
        </div>

        {error && (
          <div className="edit-profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="edit-profile-success">
            {success}
          </div>
        )}

        <form
          className="edit-profile-form"
          onSubmit={handleSubmit}
        >
          <label>
            Full name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              maxLength="60"
              required
            />
          </label>

          <label>
            Username

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
              minLength="3"
              maxLength="30"
              pattern="[A-Za-z0-9_]+"
              title="Username can only contain letters, numbers and underscores"
              required
            />

            <small>
              Your public profile link will use this
              username.
            </small>
          </label>

          <label>
            Bio

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell people a little about your travels..."
              maxLength="300"
              rows="5"
            />

            <small>
              {form.bio.length}/300 characters
            </small>
          </label>

          <div className="edit-profile-actions">
            <button
              type="button"
              className="edit-profile-cancel"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-profile-save"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}