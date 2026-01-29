import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  onUpdate,
  onClose,
  currentUserEmail,
  isAdmin,
  users = [],
}) {
  const [status, setStatus] = useState(lead.status);
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");

  const STATUS_OPTIONS = ["New", "Contacted", "Follow-up", "Under Contract", "Closed"];
  const INTERACTION_OPTIONS = ["call", "email", "meeting", "note"];

  // Save status update
  const saveStatus = async newStatus => {
    setStatus(newStatus);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      if (res.ok) onUpdate(updated);
      else console.error("Status update failed:", updated);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // Add interaction
  const addInteraction = async e => {
    e.preventDefault();
    if (!interactionType) return alert("Please select a type");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ type: interactionType, note: interactionNote }),
      });
      const data = await res.json();
      if (res.ok) onUpdate({ ...lead, interactions: data.interactions });
      else console.error("Interaction error:", data);

      setInteractionNote("");
      setInteractionType("call");
    } catch (err) {
      console.error("Interaction error:", err);
    }
  };

  // Claim lead (for pond leads)
  const claimLead = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/claim`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updated = await res.json();
      if (res.ok) onUpdate(updated);
      else console.error("Claim lead error:", updated);
    } catch (err) {
      console.error("Claim lead error:", err);
    }
  };

  // Return lead to pond
  const returnToPond = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/return`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Return lead error:", err);
    }
  };

  // Admin reassignment
  const reassignLead = async newAssignee => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/reassign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ assignedTo: newAssignee }),
      });
      const updated = await res.json();
      if (res.ok) onUpdate(updated);
      else console.error("Reassign error:", updated);
    } catch (err) {
      console.error("Reassign error:", err);
    }
  };

  // Show claim button if lead is in pond
  const canClaim = lead.assignedTo === "POND";

  // Normalize status for CSS class
  const statusClass = `status-${status.toLowerCase().replace(/\s/g, "_")}`;

  return (
    <div className="lead-modal">
      <div className={`lead-card ${statusClass}`}>
        <h2>{lead.name}</h2>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>

        <label>Status</label>
        <select value={status} onChange={e => saveStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Claim Lead */}
        {canClaim && (
          <button onClick={claimLead} className="claim-button">
            Claim Lead
          </button>
        )}

        {/* Return to Pond */}
        {lead.assignedTo === currentUserEmail && lead.assignedTo !== "POND" && (
          <button onClick={returnToPond} className="return-button">
            Return to Pond
          </button>
        )}

        {/* Interaction Form */}
        <form className="interaction-form" onSubmit={addInteraction}>
          <select value={interactionType} onChange={e => setInteractionType(e.target.value)}>
            {INTERACTION_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Note"
            value={interactionNote}
            onChange={e => setInteractionNote(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {/* Interaction History */}
        <div className="interaction-history">
          {lead.interactions?.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> - {i.note} ({i.createdBy} @ {new Date(i.date).toLocaleString()})
            </div>
          ))}
        </div>

        {/* Admin Reassign */}
        {isAdmin && (
          <div style={{ marginTop: "12px" }}>
            <label>Reassign Lead:</label>
            <select
              value={lead.assignedTo || "POND"}
              onChange={e => reassignLead(e.target.value)}
            >
              <option value="POND">POND</option>
              {users.map(u => (
                <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
