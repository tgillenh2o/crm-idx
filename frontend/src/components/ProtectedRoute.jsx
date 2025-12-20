import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (role && userRole !== role) {
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  // Authorized
  return children;
}
