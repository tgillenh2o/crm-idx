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
  const [localLead, setLocalLead] = useState(lead);
  const [status, setStatus] = useState(lead.status);
  const [interaction, setInteraction] = useState({ type: "call", note: "" });

  // Save updated field
  const saveField = async (field) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ [field]: localLead[field] }),
    });
    const updated = await res.json();
    onUpdate(updated);
  };

  // Save status
  const saveStatus = async (newStatus) => {
    setStatus(newStatus);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    onUpdate(updated);
  };

  // Claim lead
  const claimLead = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/claim`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const updated = await res.json();
    onUpdate(updated);
  };

  // Return lead to pond
  const returnToPond = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/return`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const updated = await res.json();
    onUpdate(updated);
  };

  // Add interaction
  const addInteraction = async () => {
    if (!interaction.note) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(interaction),
    });
    const updated = await res.json();
    setInteraction({ type: "call", note: "" });
    onUpdate({ ...localLead, interactions: updated.interactions });
  };

  return (
    <div className="lead-modal">
      <div className={`lead-card status-${status.toLowerCase().replace(/\s/g, "_")}`}>
        {/* Lead Info */}
        <h2>
          <input
            value={localLead.name}
            onChange={(e) => setLocalLead({ ...localLead, name: e.target.value })}
            onBlur={() => saveField("name")}
          />
        </h2>
        <p>
          <strong>Email:</strong>
          <input
            value={localLead.email}
            onChange={(e) => setLocalLead({ ...localLead, email: e.target.value })}
            onBlur={() => saveField("email")}
          />
        </p>
        <p>
          <strong>Phone:</strong>
          <input
            value={localLead.phone}
            onChange={(e) => setLocalLead({ ...localLead, phone: e.target.value })}
            onBlur={() => saveField("phone")}
          />
        </p>

        {/* Status */}
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => saveStatus(e.target.value)}
        >
          {["New", "Contacted", "Follow-up", "Under Contract", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Assigned User (Admin only) */}
        {isAdmin && (
          <div>
            <label>Assigned To</label>
            <select
              value={localLead.assignedTo}
              onChange={async (e) => {
                const assignedTo = e.target.value;
                setLocalLead({ ...localLead, assignedTo });
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
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Claim / Return Buttons */}
        <div className="lead-actions">
          {localLead.assignedTo === "POND" && (
            <button onClick={claimLead} className="claim-button">Claim Lead</button>
          )}
          {localLead.assignedTo === currentUserEmail && (
            <button onClick={returnToPond} className="return-button">Return to Pond</button>
          )}
        </div>

        {/* Interactions */}
        <div className="interaction-form">
          <select
            value={interaction.type}
            onChange={(e) => setInteraction({ ...interaction, type: e.target.value })}
          >
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="note">Note</option>
          </select>
          <input
            type="text"
            placeholder="Add note..."
            value={interaction.note}
            onChange={(e) => setInteraction({ ...interaction, note: e.target.value })}
          />
          <button onClick={addInteraction}>Add</button>
        </div>

        <div className="interaction-history">
          {localLead.interactions?.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> by {i.createdBy} on {new Date(i.date).toLocaleString()}
              <p>{i.note}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
}
