import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import MemberDashboard from "../pages/dashboard/MemberDashboard";

export default function DashboardRouter() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading dashboard...</p>;

  return user.role === "teamAdmin" ? (
    <AdminDashboard user={user} />
  ) : (
    <MemberDashboard user={user} />
  );
}
