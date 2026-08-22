import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page in <ProtectedRoute role="organizer">...</ProtectedRoute>
// role is optional — omit it to just require "logged in, any role"
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
