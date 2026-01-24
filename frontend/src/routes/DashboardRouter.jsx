import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import MemberDashboard from "../pages/dashboard/MemberDashboard";
import { useNavigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/"); // back to login
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) return <div className="loading">Loading...</div>;

  return user.role === "teamAdmin" ? <AdminDashboard /> : <MemberDashboard />;
}
