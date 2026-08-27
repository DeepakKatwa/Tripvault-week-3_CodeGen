import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Memories from "./pages/Memories";

const ProtectedRoute = ({ children }) =>
  localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthPage mode="login" />}
      />

      <Route
        path="/register"
        element={<AuthPage mode="register" />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/memories"
        element={
          <ProtectedRoute>
            <Memories />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={
              localStorage.getItem("token")
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