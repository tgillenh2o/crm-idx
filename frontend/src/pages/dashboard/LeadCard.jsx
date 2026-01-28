import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  isAdmin = false,
  onDelete,
  onAssign, // dashboard state updater
  users = [],
  isLeadPond = false,
  currentUserEmail, // for member claiming
}) {
  const [status, setStatus] = useState(lead.status || "New");
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [interactions, setInteractions] = useState(lead.interactions || []);
  const [removing, setRemoving] = useState(false);

  const assignedToName = lead.assignedTo || "Unassigned";

  // ======== STATUS UPDATE ========
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setStatus(updated.status);
    } catch (err) {
      console.error(err);
    }
  };

  // ======== LOG INTERACTION ========
  const handleInteraction = async () => {
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
          body: JSON.stringify({ type: interactionType, note: interactionNote }),
        }
      );
      const data = await res.json();
      setInteractions(data.interactions || []);
      setInteractionNote("");
    } catch (err) {
      console.error("Failed to log interaction:", err);
    }
  };

  // ======== MEMBER CLAIM LEAD ========
  const handleClaim = async () => {
    if (!currentUserEmail) return;
    setRemoving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/claim`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedLead = await res.json();
      if (onAssign) onAssign(lead._id, updatedLead.assignedTo);
    } catch (err) {
      console.error("Failed to claim lead:", err);
      setRemoving(false);
    }
  };

  // ======== ADMIN REASSIGN LEAD ========
  const handleReassign = async (e) => {
    const newAssignedTo = e.target.value;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/reassign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ assignedTo: newAssignedTo }),
        }
      );
      const updatedLead = await res.json();
      if (onAssign) onAssign(lead._id, updatedLead.assignedTo);
    } catch (err) {
      console.error("Failed to reassign lead:", err);
    }
  };

  return (
    <div className={`lead-card status-${status.toLowerCase()} ${removing ? "removing" : ""}`}>
      <div className="lead-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Assigned To:</strong> {assignedToName}</p>

        <p className={`status-${status.toLowerCase()}`}>
          <strong>Status:</strong>{" "}
          <select value={status} onChange={handleStatusChange}>
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-up</option>
            <option>Closed</option>
          </select>
        </p>

        {/* ADMIN REASSIGN */}
        {isAdmin && users.length > 0 && (
          <p>
            <strong>Reassign:</strong>{" "}
            <select value={lead.assignedTo || ""} onChange={handleReassign}>
              <option value="">Unassigned</option>
              <option value="POND">Lead Pond</option>
              {users.map((u) => (
                <option key={u._id} value={u.email}>
                  {u.name}
                </option>
              ))}
            </select>
          </p>
        )}
      </div>

      {/* MEMBER CLAIM */}
      {isLeadPond && currentUserEmail && !isAdmin && (
        <button className="claim-button" onClick={handleClaim}>
          Claim Lead
        </button>
      )}

      {/* ADMIN DELETE */}
      {isAdmin && onDelete && (
        <button className="delete-button" onClick={() => onDelete(lead._id)}>
          Delete Lead
        </button>
      )}

      {/* INTERACTIONS */}
      <div className="interaction-form">
        <select value={interactionType} onChange={(e) => setInteractionType(e.target.value)}>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
        </select>
        <input
          type="text"
          placeholder="Add note..."
          value={interactionNote}
          onChange={(e) => setInteractionNote(e.target.value)}
        />
        <button onClick={handleInteraction}>Add Interaction</button>
      </div>

      <div className="interaction-history">
        <h4>Interaction History</h4>
        {interactions.length === 0 ? (
          <p>No interactions yet</p>
        ) : (
          interactions.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> by {i.createdBy || "Unknown"} on{" "}
              {new Date(i.date).toLocaleString()}
              <br />
              {i.note}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
