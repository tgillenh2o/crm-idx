import LeadsList from "../../components/LeadsList";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <LeadsList canDelete />
    </div>
  );
}
