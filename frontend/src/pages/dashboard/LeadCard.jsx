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
  const [status, setStatus] = useState(lead.status || "New");
  const [interactionType, setInteractionType] = useState("Call");
  const [interactionNote, setInteractionNote] = useState("");

  // Map UI status text to backend-safe string
  const STATUS_MAP = {
    "New": "new",
    "Contacted": "contacted",
    "Follow-up": "follow-up",
    "Under Contract": "under_contract",
    "Closed": "closed",
  };

  const saveStatus = async newStatusText => {
    const backendStatus = STATUS_MAP[newStatusText] || newStatusText;
    setStatus(newStatusText); // Update UI immediately

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: backendStatus }),
        }
      );

      if (!res.ok) {
        console.error("Status update failed:", await res.text());
        return;
      }

      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

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

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Return lead error:", err);
    }
  };

  const handleAddInteraction = async () => {
    if (!interactionNote.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: interactionType,
            note: interactionNote,
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      // Update lead locally
      onUpdate({ ...lead, interactions: data.interactions });

      setInteractionNote("");
    } catch (err) {
      console.error("Add interaction error:", err);
    }
  };

  return (
    <div className="lead-modal">
      <div className={`lead-card status-${status.toLowerCase().replace(" ", "-")}`}>
        <h2>{lead.name}</h2>

        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>

        {/* Status */}
        <label>Status</label>
        <select
          value={status}
          onChange={e => saveStatus(e.target.value)}
        >
          {Object.keys(STATUS_MAP).map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Return to Pond */}
        {lead.assignedTo === currentUserEmail && (
          <button onClick={returnToPond} className="return-button">
            Return to Lead Pond
          </button>
        )}

        {/* Interaction History */}
        <div className="interaction-history">
          <h4>Interactions</h4>
          {lead.interactions && lead.interactions.length > 0 ? (
            lead.interactions
              .slice()
              .reverse() // newest first
              .map((i, idx) => (
                <div key={idx} className="interaction-item">
                  <strong>{i.type}</strong>: {i.note}
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {new Date(i.date).toLocaleString()} — {i.createdBy}
                  </div>
                </div>
              ))
          ) : (
            <p style={{ opacity: 0.6 }}>No interactions yet</p>
          )}
        </div>

        {/* Add Interaction */}
        <div className="interaction-form">
          <select
            value={interactionType}
            onChange={e => setInteractionType(e.target.value)}
          >
            <option>Call</option>
            <option>Text</option>
            <option>Email</option>
            <option>Showing</option>
          </select>
          <input
            type="text"
            placeholder="Add note…"
            value={interactionNote}
            onChange={e => setInteractionNote(e.target.value)}
          />
          <button onClick={handleAddInteraction}>Add</button>
        </div>

        {/* Close button */}
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}
