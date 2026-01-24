import LeadsList from "../../components/LeadsList";

export default function MemberDashboard() {
  return (
    <div>
      <h1>My Leads</h1>
      <LeadsList canDelete={false} />
    </div>
  );
}
