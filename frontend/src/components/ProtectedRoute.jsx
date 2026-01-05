import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>; // Prevent redirect while checking auth

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role.toLowerCase() !== "admin") {
    return <Navigate to="/dashboard" />; // Kick non-admins to user dashboard
  }

  return children;
};

export default ProtectedRoute;