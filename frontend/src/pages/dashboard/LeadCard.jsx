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

  // ================== UPDATE STATUS ==================
  const saveStatus = async (newStatus) => {
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

      if (!res.ok) throw new Error("Status update failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  // ================== RETURN TO POND ==================
  const returnToPond = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/return`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Return to pond failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Return error:", err);
      alert("Failed to return lead");
    }
  };

  // ================== CLAIM LEAD ==================
  const claimLead = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/claim`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Claim lead failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Claim error:", err);
      alert("Failed to claim lead");
    }
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
          onChange={(e) => {
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

        {/* Show RETURN button if lead is assigned to current user (member) */}
        {lead.assignedTo === currentUserEmail && (
          <button className="return-button" onClick={returnToPond}>
            Return to Lead Pond
          </button>
        )}

        {/* Show CLAIM button if lead is in the pond */}
        {lead.assignedTo === "POND" && (
          <button className="claim-button" onClick={claimLead}>
            Claim Lead
          </button>
        )}

        <button className="delete-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
