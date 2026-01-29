import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  onUpdate,
  onClose,
  isAdmin,
  users = [],
  currentUserEmail,
}) {
  const [status, setStatus] = useState(lead.status);

  const saveStatus = async newStatus => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const updated = await res.json();
    onUpdate(updated);
  };

  const returnToPond = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/return`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const updated = await res.json();
    onUpdate(updated);
  };

  return (
    <div className="lead-modal">
      <div className="lead-card">
        <h2>{lead.name}</h2>

        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>

        <label>Status</label>
        <select
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            saveStatus(e.target.value);
          }}
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Under Contract</option>
          <option>Closed</option>
        </select>

        {lead.assignedTo === currentUserEmail && (
          <button onClick={returnToPond} className="danger">
            Return to Lead Pond
          </button>
        )}

        <button onClick={onClose}>Close</button>
{/* Interaction History */}
<div className="interaction-history">
  <h4>Interactions</h4>

  {lead.interactions && lead.interactions.length > 0 ? (
    lead.interactions.map((interaction, index) => (
      <div key={index} className="interaction-item">
        <strong>{interaction.type}</strong>: {interaction.note}
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          {new Date(interaction.date).toLocaleString()}
        </div>
      </div>
    ))
  ) : (
    <p style={{ opacity: 0.6 }}>No interactions yet</p>
  )}
</div>

      </div>
    </div>
  );
}
