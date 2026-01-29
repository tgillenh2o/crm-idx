import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({ lead, onUpdate, onClose, isAdmin, users = [], currentUserEmail }) {
  const [status, setStatus] = useState(lead.status);
  const [interactionType, setInteractionType] = useState("note");
  const [interactionNote, setInteractionNote] = useState("");

  const saveStatus = async (newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      onUpdate(updated);
      setStatus(newStatus);
    } catch (err) {
      alert("Status update failed");
    }
  };

  const addInteraction = async () => {
    if (!interactionNote.trim()) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ type: interactionType, note: interactionNote }),
    });
    const data = await res.json();
    onUpdate({ ...lead, interactions: data.interactions });
    setInteractionNote("");
  };

  const claimLead = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/claim`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const updated = await res.json();
    onUpdate(updated);
  };

  const returnToPond = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/return`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
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
        <select value={status} onChange={(e) => saveStatus(e.target.value)}>
          {["New", "Contacted", "Follow-up", "Under Contract", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div className="interaction-form">
          <select value={interactionType} onChange={(e) => setInteractionType(e.target.value)}>
            {["note", "call", "email", "meeting"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            placeholder="Add note..."
            value={interactionNote}
            onChange={(e) => setInteractionNote(e.target.value)}
          />
          <button onClick={addInteraction}>Add</button>
        </div>

        <div className="interaction-history">
          {lead.interactions?.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> by {i.createdBy} on {new Date(i.date).toLocaleString()}:
              <div>{i.note}</div>
            </div>
          ))}
        </div>

        <div className="actions">
          {lead.assignedTo === "POND" && <button onClick={claimLead} className="claim-button">Claim Lead</button>}
          {lead.assignedTo === currentUserEmail && <button onClick={returnToPond} className="return-button">Return to Pond</button>}
          {isAdmin && (
            <select
              value={lead.assignedTo}
              onChange={async (e) => {
                const assignedTo = e.target.value;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/reassign`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                  body: JSON.stringify({ assignedTo }),
                });
                const updated = await res.json();
                onUpdate(updated);
              }}
            >
              <option value="POND">POND</option>
              {users.map((u) => <option key={u.email} value={u.email}>{u.name}</option>)}
            </select>
          )}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
