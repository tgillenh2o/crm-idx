import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";

export default function LeadCard({
  lead,
  isAdmin = false,
  onDelete,
  onAssign,
  users = [],
  isLeadPond = false,
  currentUserEmail
}) {
  const [status, setStatus] = useState(lead.status || "New");
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [interactions, setInteractions] = useState(lead.interactions || []);
  const [removing, setRemoving] = useState(false);
  const [glowColor, setGlowColor] = useState("");
  const prevLeadRef = useRef(lead);

  const assignedToName = lead.assignedTo || "Unassigned";

  // Detect changes for glow effect
  useEffect(() => {
    const prevLead = prevLeadRef.current;
    if (!prevLead) return;

    let color = "";
    if (prevLead.assignedTo !== lead.assignedTo) {
      if (lead.assignedTo === currentUserEmail) color = "green";
      else if (lead.assignedTo === "POND") color = "blue";
      else color = "yellow";
    } else if (prevLead.status !== lead.status) {
      color = "green";
    } else if ((prevLead.interactions?.length || 0) !== (lead.interactions?.length || 0)) {
      color = "green";
    }

    if (color) {
      setGlowColor(color);
      const timer = setTimeout(() => setGlowColor(""), 1200);
      return () => clearTimeout(timer);
    }

    prevLeadRef.current = lead;
  }, [lead]);

  const handleStatusChange = async e => {
    const newStatus = e.target.value;
    setStatus(newStatus);
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
    } catch (err) { console.error(err); }
  };

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
      setInteractions(prev => [...data.interactions].map((i, idx, arr) => ({ ...i, justAdded: idx === arr.length - 1 })));
      setInteractionNote("");
    } catch (err) { console.error(err); }
  };

  return (
    <div className={`lead-card ${isLeadPond ? "lead-pond" : ""} ${removing ? "removing" : ""} ${glowColor ? "glow-" + glowColor : ""}`}>
      <div className="lead-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Assigned To:</strong> {assignedToName}</p>
        <p className={`status-${status}`}><strong>Status:</strong>
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
        <input type="text" placeholder="Add note..." value={interactionNote} onChange={e => setInteractionNote(e.target.value)} />
        <button onClick={handleInteraction}>Add Interaction</button>
      </div>

      <div className="interaction-history">
        <h4>Interaction History</h4>
        {interactions.length === 0 ? <p>No interactions yet</p> :
          interactions.map((i, idx) => (
            <div key={idx} className={`interaction-item ${i.justAdded ? "new-interaction" : ""}`}>
              <strong>{i.type}</strong> by {i.createdBy || "Unknown"} on {new Date(i.date).toLocaleString()}<br />
              {i.note}
            </div>
          ))
        }
      </div>
    </div>
  );
}
