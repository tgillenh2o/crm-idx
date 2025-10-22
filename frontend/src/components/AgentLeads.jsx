import React from 'react';

export default function AgentLeads({ leads }) {
  if (!leads || leads.length === 0) return <div>No leads yet.</div>;

  return (
    <div>
      {leads.map((lead) => (
        <div key={lead._id} style={{ padding: 8, borderBottom: "1px solid #ccc" }}>
          <strong>{lead.name}</strong> ({lead.email}) - {lead.status}
        </div>
      ))}
    </div>
  );
}
