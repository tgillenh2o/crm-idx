import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  onUpdate,
  onClose,
  isAdmin,
  currentUserEmail,
  claimLead,
  returnToPond,
  addInteraction,
}) {
  const [editableLead, setEditableLead] = useState({ ...lead });
  const [newInteraction, setNewInteraction] = useState({ type: "call", note: "" });

  const saveLead = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editableLead),
        }
      );
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Failed to save lead:", err);
    }
  };

  const saveInteraction = async () => {
    if (!newInteraction.note.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newInteraction),
        }
      );

      const data = await res.json();
      addInteraction(data.interactions);
      setNewInteraction({ type: "call", note: "" });
    } catch (err) {
      console.error("Failed to add interaction:", err);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setEditableLead({ ...editableLead, status: newStatus });

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

  const isPondLead = lead.assignedTo === "POND";
  const isMyLead = lead.assignedTo === currentUserEmail;

  return (
    <div className="lead-modal">
      <div className={`lead-card status-${editableLead.status.toLowerCase().replace(" ", "_")}`}>
        <h2>Edit Lead</h2>

        <label>Name</label>
        <input
          type="text"
          value={editableLead.name}
          onChange={(e) => setEditableLead({ ...editableLead, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          value={editableLead.email}
          onChange={(e) => setEditableLead({ ...editableLead, email: e.target.value })}
        />

        <label>Phone</label>
        <input
          type="text"
          value={editableLead.phone}
          onChange={(e) => setEditableLead({ ...editableLead, phone: e.target.value })}
        />

        <label>Status</label>
        <select value={editableLead.status} onChange={handleStatusChange}>
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Under Contract</option>
          <option>Closed</option>
        </select>

        <div className="lead-buttons">
          {isPondLead && (
            <button className="claim-button" onClick={() => claimLead(lead._id)}>
              Claim Lead
            </button>
          )}

          {isMyLead && (
            <button className="return-button" onClick={() => returnToPond(lead._id)}>
              Return to Pond
            </button>
          )}

          <button className="save-button" onClick={saveLead}>
            Save
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="interaction-section">
          <h3>Interactions</h3>
          <div className="interaction-form">
            <select
              value={newInteraction.type}
              onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
            >
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="note">Note</option>
            </select>
            <input
              type="text"
              placeholder="Add a note..."
              value={newInteraction.note}
              onChange={(e) => setNewInteraction({ ...newInteraction, note: e.target.value })}
            />
            <button onClick={saveInteraction}>Add</button>
          </div>

          <div className="interaction-history">
            {editableLead.interactions?.map((i, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{i.type}</strong> - {i.note} <em>({new Date(i.date).toLocaleString()})</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
