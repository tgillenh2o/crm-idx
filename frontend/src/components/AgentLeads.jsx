import React from "react";

export default function AgentLeads({ leads }) {
  if (!leads.length) return <div>No leads assigned</div>;
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h4>Your Leads</h4>
      <ul>
        {leads.map((l) => (
          <li key={l._id}>{l.name} - {l.email} - {l.phone} ({l.status})</li>
        ))}
      </ul>
    </div>
  );
}
