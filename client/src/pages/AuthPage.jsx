import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import api from "../api/axios";
import "./AuthPage.css";

export default function AuthPage({ mode }) {
  const navigate = useNavigate();

  const isRegister =
    mode === "register";

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (localStorage.getItem("token")) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const payload = isRegister
        ? {
            name: form.name.trim(),
            username:
              form.username
                .trim()
                .toLowerCase(),
            email:
              form.email
                .trim()
                .toLowerCase(),
            password: form.password,
          }
        : {
            email:
              form.email
                .trim()
                .toLowerCase(),
            password: form.password,
          };

      const { data } =
        await api.post(
          `/auth/${mode}`,
          payload
        );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Could not connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="brand-mark">
          TV
        </div>

        <p className="eyebrow">
          YOUR TRAVEL JOURNAL
        </p>

        <h1>
          Keep every journey
          <br />
          close to you.
        </h1>

        <p>
          Plan trips, remember
          destinations and collect
          the stories that make
          travel unforgettable.
        </p>
      </section>

      <section className="auth-panel">
        <form
          className="auth-card"
          onSubmit={submit}
        >
          <span className="auth-logo">
            TripVault
          </span>

          <h2>
            {isRegister
              ? "Create your account"
              : "Welcome back"}
          </h2>

          <p>
            {isRegister
              ? "Start building your personal travel archive."
              : "Sign in to continue your travel story."}
          </p>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {isRegister && (
            <label>
              Full name

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Adarsh Pattar"
                maxLength="60"
                required
              />
            </label>
          )}

          {isRegister && (
            <label>
              Username

              <input
                type="text"
                name="username"
                value={
                  form.username
                }
                onChange={
                  handleChange
                }
                placeholder="adarsh_pattar"
                minLength="3"
                maxLength="30"
                pattern="[A-Za-z0-9_]+"
                title="Username can contain only letters, numbers and underscores"
                required
              />
            </label>
          )}

          <label>
            Email address

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              minLength="6"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create account"
              : "Sign in"}
          </button>

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "New to TripVault?"}{" "}

            <Link
              to={
                isRegister
                  ? "/login"
                  : "/register"
              }
            >
              {isRegister
                ? "Sign in"
                : "Create account"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}