import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Memories from "./pages/Memories";
import TripDetails from "./pages/TripDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

const ProtectedRoute = ({ children }) => {
  return localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

export default function App() {
  const hasToken = Boolean(
    localStorage.getItem("token")
  );

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={<AuthPage mode="login" />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<AuthPage mode="register" />}
      />

      {/* PUBLIC PROFILE - NO LOGIN REQUIRED */}
      <Route
        path="/profile/:username"
        element={<Profile />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* EDIT PROFILE */}
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* DOCUMENTS */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      {/* MEMORIES */}
      <Route
        path="/memories"
        element={
          <ProtectedRoute>
            <Memories />
          </ProtectedRoute>
        }
      />

      {/* TRIP DETAILS */}
      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            <TripDetails />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTES */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              hasToken
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}