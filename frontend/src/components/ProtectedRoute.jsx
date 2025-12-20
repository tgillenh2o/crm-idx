import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return setLoading(false);

    axios
      .get("https://crm-idx.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserRole(res.data.role))
      .catch(() => setUserRole(null))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;

  return children;
}
