import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  onUpdate,
  onClose,
  isAdmin = false,
  users = [],
  currentUserEmail,
}) {
  const [status, setStatus] = useState(lead.status);

  const saveStatus = async newStatus => {
    try {
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
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const claimLead = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/claim`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

        <div className="lead-actions">
          {lead.assignedTo === "POND" && (
            <button className="claim-button" onClick={claimLead}>Claim Lead</button>
          )}

          {lead.assignedTo === currentUserEmail && (
            <button className="return-button" onClick={returnToPond}>Return to Pond</button>
          )}

          {isAdmin && (
            <select
              value={lead.assignedTo}
              onChange={async e => {
                const assignedTo = e.target.value;
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/reassign`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ assignedTo }),
                  }
                );
                const updated = await res.json();
                onUpdate(updated);
              }}
            >
              <option value="POND">POND</option>
              {users.map(u => (
                <option key={u._id} value={u.email}>{u.name}</option>
              ))}
            </select>
          )}
        </div>

        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
