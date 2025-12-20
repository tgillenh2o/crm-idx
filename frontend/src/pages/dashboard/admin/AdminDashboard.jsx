import DashboardLayout from "../../../components/DashboardLayout";
import "./admin.css";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <h1>Admin Dashboard</h1>
      <p className="muted">Manage your team and listings</p>

      {/* existing admin content */}
    </DashboardLayout>
  );
}
