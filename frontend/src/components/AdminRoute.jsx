// src/components/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  // Show nothing or a loader while auth is loading
  if (loading) return <p>Loading...</p>;

  // Redirect if user is not admin or not logged in
  if (user && user.role.toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if user is admin
  return children;
}
