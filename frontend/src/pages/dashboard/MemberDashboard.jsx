import DashboardLayout from "../../components/DashboardLayout";

export default function MemberDashboard() {
  return (
    <DashboardLayout title="Agent Dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        <div className="card">My Leads</div>
        <div className="card">Saved Listings</div>
      </div>
    </DashboardLayout>
  );
}
