import React from "react";

export default function LeadCard({ lead, isAdmin, onDelete }) {
  const statusClass =
    lead.status === "New"
      ? "status-new"
      : lead.status === "Pending"
      ? "status-pending"
      : "status-contacted";

  return (
    <div className="lead-card">
      <h3>{lead.name}</h3>
      <p className={statusClass}>{lead.status}</p>
      {isAdmin && (
        <button onClick={() => onDelete(lead._id)}>Delete Lead</button>
      )}
    </div>
  );
}
