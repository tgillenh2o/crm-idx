import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import MemberDashboard from "../pages/dashboard/MemberDashboard";
import { Navigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />;

  return user.role === "teamAdmin"
    ? <AdminDashboard />
    : <MemberDashboard />;
}
