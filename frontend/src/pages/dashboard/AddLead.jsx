import React, { useState, useEffect } from "react";
import "./LeadCard.css";

export default function LeadCard({ lead, isAdmin, users, currentUserEmail, onUpdate, onClose }) {
  // Local state with defaults
  const [editableLead, setEditableLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
    assignedTo: "",
    interactions: [],
    ...lead
  });

  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState("");
  const [newInteraction, setNewInteraction] = useState("");

  // Sync local state when lead changes
  useEffect(() => {
    setEditableLead({
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      status: lead?.status || "New",
      assignedTo: lead?.assignedTo || "",
      interactions: Array.isArray(lead?.interactions) ? lead.interactions : []
    });
  }, [lead]);

  const safeUsers = Array.isArray(users) ? users : [];

  const triggerFlash = () => {
    setFlash(isAdmin ? "flash-admin" : "flash-member");
    setTimeout(() => setFlash(""), 800);
  };

  const handleChange = e => setEditableLead({ ...editableLead, [e.target.name]: e.target.value });

  // Save edits and trigger parent update
  const handleSave = () => {
    onUpdate(editableLead);
    setEditing(false);
    triggerFlash();
  };

  // Claim lead from Pond (members)
  const handleClaim = () => {
    const updated = { ...editableLead, assignedTo: currentUserEmail };
    setEditableLead(updated);
    onUpdate(updated);
    triggerFlash();
  };

  // Reassign lead (admin)
  const handleReassign = newEmail => {
    const updated = { ...editableLead, assignedTo: newEmail };
    setEditableLead(updated);
    onUpdate(updated);
    triggerFlash();
  };

  // Add a new interaction
  const handleAddInteraction = () => {
    if (!newInteraction.trim()) return;
    const updated = {
      ...editableLead,
      interactions: [
        ...editableLead.interactions,
        {
          type: "note",
          text: newInteraction,
          date: new Date().toISOString(),
          createdBy: currentUserEmail
        }
      ]
    };
    setEditableLead(updated);
    onUpdate(updated);
    setNewInteraction("");
    triggerFlash();
  };

  // Auto-save when modal closes
  const handleClose = () => {
    onUpdate(editableLead); // ensure latest changes are saved
    onClose();
  };

  const memberCanEdit = !isAdmin && editableLead.assignedTo === currentUserEmail;
  const statusClass = editableLead.status ? editableLead.status.toLowerCase().replace(" ", "-") : "new";

  return (
    <div className="lead-modal">
      <div className={`lead-card ${flash} status-${statusClass}`}>
        {/* Close button */}
        <button className="close-button" onClick={handleClose}>×</button>

        {/* Lead Name */}
        <h3>{editableLead.name}</h3>

        {/* Editable fields */}
        {(isAdmin || memberCanEdit) && editing ? (
          <div className="lead-edit-form">
            <label>Name: <input name="name" value={editableLead.name} onChange={handleChange} /></label>
            <label>Email: <input name="email" value={editableLead.email} onChange={handleChange} /></label>
            <label>Phone: <input name="phone" value={editableLead.phone} onChange={handleChange} /></label>
            <label>
              Status:
              <select
                name="status"
                value={editableLead.status}
                onChange={e => {
                  handleChange(e);
                  onUpdate({ ...editableLead, status: e.target.value }); // instant dashboard update
                  triggerFlash();
                }}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Follow-Up</option>
                <option>Under Contract</option>
                <option>Closed</option>
              </select>
            </label>
            <div className="form-buttons">
              <button className="claim-button" onClick={handleSave}>Save</button>
              <button className="return-button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="lead-details">
            <p><strong>Email:</strong> {editableLead.email}</p>
            <p><strong>Phone:</strong> {editableLead.phone}</p>
            <p><strong>Status:</strong> {editableLead.status}</p>
            <p><strong>Assigned To:</strong> {editableLead.assignedTo || "POND"}</p>

            {/* Claim from Pond */}
            {!isAdmin && (!editableLead.assignedTo || editableLead.assignedTo === "POND") && (
              <button className="claim-button" onClick={handleClaim}>Claim from Pond</button>
            )}

            {/* Admin actions */}
            {isAdmin && (
              <div className="admin-actions">
                <label>
                  Reassign:
                  <select
                    value={editableLead.assignedTo || ""}
                    onChange={e => handleReassign(e.target.value)}
                  >
                    <option value="">POND</option>
                    {safeUsers.map(u => (
                      <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </label>
                <button className="close-button" onClick={() => setEditing(true)}>Edit Lead</button>
              </div>
            )}

            {/* Member edit button */}
            {memberCanEdit && !editing && (
              <button className="close-button" onClick={() => setEditing(true)}>Edit Lead</button>
            )}
          </div>
        )}

        {/* Interaction History */}
        <div className="interaction-history">
          <h4>Interactions</h4>
          {editableLead.interactions.length > 0 ? (
            editableLead.interactions.map((note, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{note.createdBy || note.author || "User"}:</strong> {note.text || note.note}
              </div>
            ))
          ) : (
            <p>No interactions yet.</p>
          )}

          {/* Add interaction form */}
          <div className="interaction-form">
            <input
              type="text"
              placeholder="Add a note..."
              value={newInteraction}
              onChange={e => setNewInteraction(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddInteraction()}
            />
            <button onClick={handleAddInteraction}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
