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
  const [interactionNote, setInteractionNote] = useState("");
  const [interactionType, setInteractionType] = useState("note");

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
        { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
        { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) throw new Error("Claim lead failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Claim error:", err);
      alert("Failed to claim lead");
    }
  };

  // ================== ADD INTERACTION ==================
  const addInteraction = async () => {
    if (!interactionNote) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ type: interactionType, note: interactionNote }),
        }
      );
      if (!res.ok) throw new Error("Add interaction failed");
      const data = await res.json();
      onUpdate({ ...lead, interactions: data.interactions });
      setInteractionNote("");
    } catch (err) {
      console.error("Add interaction error:", err);
      alert("Failed to add interaction");
    }
  };

  // ================== REASSIGN (ADMIN ONLY) ==================
  const reassignLead = async (newUserEmail) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/reassign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ assignedTo: newUserEmail }),
        }
      );
      if (!res.ok) throw new Error("Reassign failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Reassign error:", err);
      alert("Failed to reassign lead");
    }
  };

  return (
    <div className="lead-modal">
      <div className="lead-card">
        <h2>{lead.name}</h2>

        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>

        {/* Status Selector */}
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

        {/* CLAIM / RETURN BUTTONS */}
        {lead.assignedTo === currentUserEmail && (
          <button className="return-button" onClick={returnToPond}>
            Return to Lead Pond
          </button>
        )}
        {lead.assignedTo === "POND" && (
          <button className="claim-button" onClick={claimLead}>
            Claim Lead
          </button>
        )}

        {/* ADMIN REASSIGN */}
        {isAdmin && (
          <div>
            <label>Reassign Lead</label>
            <select
              value={lead.assignedTo}
              onChange={(e) => reassignLead(e.target.value)}
            >
              <option value="POND">POND</option>
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* INTERACTIONS */}
        <div className="interaction-form">
          <label>Add Interaction</label>
          <select
            value={interactionType}
            onChange={(e) => setInteractionType(e.target.value)}
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
          </select>
          <textarea
            placeholder="Write a note..."
            value={interactionNote}
            onChange={(e) => setInteractionNote(e.target.value)}
          />
          <button onClick={addInteraction}>Add Interaction</button>
        </div>

        {/* Interaction history */}
        <div className="interaction-history">
          <h4>History</h4>
          {lead.interactions?.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> ({new Date(i.date).toLocaleString()})<br />
              {i.note}<br />
              <em>by {i.createdBy}</em>
            </div>
          ))}
        </div>

        <button className="delete-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
