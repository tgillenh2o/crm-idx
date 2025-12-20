import DashboardLayout from "../../components/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <div className="card">Team Members</div>
        <div className="card">Total Leads</div>
        <div className="card">IDX Listings</div>
      </div>
    </DashboardLayout>
  );
}
