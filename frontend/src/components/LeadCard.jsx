import api from "../api";

export default function LeadCard({ lead, pond }) {
  const moveToPond = async () => {
    await api.put(`/leads/${lead._id}/pond`);
    window.location.reload();
  };

  return (
    <div className="lead-card">
      <h4>{lead.name}</h4>
      <p>{lead.email}</p>
      {!pond && <button onClick={moveToPond}>Move to Pond</button>}
    </div>
  );
}
