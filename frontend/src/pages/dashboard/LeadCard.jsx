import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({ lead, onUpdate, onClose, currentUserEmail }) {
  const [status, setStatus] = useState(lead.status);
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");

  const STATUS_OPTIONS = ["New", "Contacted", "Follow-up", "Under Contract", "Closed"];
  const INTERACTION_OPTIONS = ["call", "email", "meeting", "note"];

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
      if (!res.ok) console.error("Status update failed:", updated);
      else onUpdate(updated);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const addInteraction = async e => {
    e.preventDefault();
    if (!interactionType) return alert("Please select type");

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
      if (!res.ok) console.error("Interaction error:", data);
      else onUpdate({ ...lead, interactions: data.interactions });
      setInteractionNote("");
      setInteractionType("call");
    } catch (err) {
      console.error("Interaction error:", err);
    }
  };

  return (
    <div className="lead-modal">
      <div className="lead-card">
        <h2>{lead.name}</h2>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>

        <label>Status</label>
        <select value={status} onChange={e => saveStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>

        <form className="interaction-form" onSubmit={addInteraction}>
          <label>New Interaction:</label>
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

        <div className="interaction-history">
          {lead.interactions?.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> - {i.note} ({i.createdBy} @ {new Date(i.date).toLocaleString()})
            </div>
          ))}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
