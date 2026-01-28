import React, { useState, useEffect } from "react";
import "./Dashboard.css";

export default function LeadCard({
  lead,
  isAdmin = false,
  onDelete,
  onAssign,
  users = [],
  isLeadPond = false,
  currentUserEmail,
}) {
  const [status, setStatus] = useState(lead.status || "New");
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [interactions, setInteractions] = useState(lead.interactions || []);
  const [removing, setRemoving] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const [recentlyAssigned, setRecentlyAssigned] = useState(false);

  const assignedToName = lead.assignedTo || "Unassigned";

  // --- Status color mapping
  const statusColors = {
    "New": "#e0f7fa",          // light cyan
    "Contacted": "#fff3e0",    // light orange
    "Follow-up": "#e8f5e9",    // light green
    "Closed": "#f3e5f5"        // light purple
  };

  // --- Glow effect when assignedTo changes
  useEffect(() => {
    if (!lead.assignedTo) return;
    setRecentlyAssigned(true);
    const timer = setTimeout(() => setRecentlyAssigned(false), 1500);
    return () => clearTimeout(timer);
  }, [lead.assignedTo]);

  // --- Card style
  const cardStyle = {
    backgroundColor: statusColors[status] || "#ffffff",
    color: "#333", // dark text for readability
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    boxShadow: recentlyUpdated
      ? "0 0 10px #64b5f6"      // status glow (blue)
      : recentlyAssigned
        ? "0 0 10px #ffb74d"    // assigned glow (orange)
        : "none",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px"
  };

  // --- Handle status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setRecentlyUpdated(true);
    setTimeout(() => setRecentlyUpdated(false), 1500);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      setStatus(updated.status);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // --- Log interaction
  const handleInteraction = async () => {
    if (!interactionNote.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ type: interactionType, note: interactionNote })
      });
      const data = await res.json();
      setInteractions(data.interactions || []);
      setInteractionNote("");
    } catch (err) {
      console.error("Failed to log interaction:", err);
    }
  };

  return (
    <div className={`lead-card ${isLeadPond ? "lead-pond" : ""} ${removing ? "removing" : ""}`} style={cardStyle}>

      <div className="lead-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Assigned To:</strong> {assignedToName}</p>

        <p><strong>Status:</strong>
          <select value={status} onChange={handleStatusChange}>
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-up</option>
            <option>Closed</option>
          </select>
        </p>

        {isAdmin && onAssign && users.length > 0 && (
          <p><strong>Reassign:</strong>
            <select value={lead.assignedTo || ""} onChange={e => onAssign(lead._id, e.target.value)}>
              <option value="">Unassigned</option>
              <option value="POND">Lead Pond</option>
              {users.map(u => <option key={u._id} value={u.email}>{u.name}</option>)}
            </select>
          </p>
        )}
      </div>

      {isLeadPond && onAssign && currentUserEmail && (
        <button className="claim-button" onClick={() => {
          setRemoving(true);
          setTimeout(() => onAssign(lead._id, currentUserEmail), 300);
        }}>Claim Lead</button>
      )}

      {isAdmin && onDelete && (
        <button className="delete-button" onClick={() => onDelete(lead._id)}>Delete Lead</button>
      )}

      <div className="interaction-form">
        <select value={interactionType} onChange={e => setInteractionType(e.target.value)}>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
        </select>
        <input
          type="text"
          placeholder="Add note..."
          value={interactionNote}
          onChange={e => setInteractionNote(e.target.value)}
        />
        <button onClick={handleInteraction}>Add Interaction</button>
      </div>

      <div className="interaction-history">
        <h4>Interaction History</h4>
        {interactions.length === 0 ? <p>No interactions yet</p> :
          interactions.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> by {i.createdBy || "Unknown"} on {new Date(i.date).toLocaleString()}<br/>
              {i.note}
            </div>
          ))
        }
      </div>

    </div>
  );
}
