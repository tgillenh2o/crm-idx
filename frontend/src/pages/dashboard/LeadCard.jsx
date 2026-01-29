import React, { useState, useEffect } from "react";
import "./LeadCard.css";

export default function LeadCard({ lead, isAdmin, users, currentUserEmail, onUpdate, onClose }) {
  // Defensive defaults to prevent crashes
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

  // Flash animation on update
  const triggerFlash = () => {
    setFlash(isAdmin ? "flash-admin" : "flash-member");
    setTimeout(() => setFlash(""), 800);
  };

  // Field changes
  const handleChange = e => setEditableLead({ ...editableLead, [e.target.name]: e.target.value });

  // Save edits
  const handleSave = () => {
    onUpdate(editableLead);
    setEditing(false);
    triggerFlash();
  };

  // Member claim from pond
  const handleClaim = () => {
    const updated = { ...editableLead, assignedTo: currentUserEmail };
    onUpdate(updated);
    triggerFlash();
  };

  // Admin reassign
  const handleReassign = newEmail => {
    const updated = { ...editableLead, assignedTo: newEmail };
    onUpdate(updated);
    triggerFlash();
  };

  const memberCanEdit = !isAdmin && editableLead.assignedTo === currentUserEmail;
  const statusClass = editableLead.status ? editableLead.status.toLowerCase().replace(" ", "-") : "new";

  // Safe interaction renderer
  const renderNote = note => {
    if (typeof note === "string") return note;
    if (note.note) return note.note;
    return JSON.stringify(note);
  };

  const renderAuthor = note => note.createdBy || note.author || "User";

  return (
    <div className="lead-modal">
      <div className={`lead-card ${flash} status-${statusClass}`}>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>×</button>

        {/* Lead name */}
        <h3>{editableLead.name}</h3>

        {/* Editable form */}
        {(isAdmin || memberCanEdit) && editing ? (
          <div className="lead-edit-form">
            <label>Name: <input name="name" value={editableLead.name} onChange={handleChange} /></label>
            <label>Email: <input name="email" value={editableLead.email} onChange={handleChange} /></label>
            <label>Phone: <input name="phone" value={editableLead.phone} onChange={handleChange} /></label>
            <label>
              Status:
              <select name="status" value={editableLead.status} onChange={handleChange}>
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

            {/* Member claim from pond */}
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

        {/* Interaction history */}
        <div className="interaction-history">
          <h4>Interactions</h4>
          {editableLead.interactions.length > 0 ? (
            editableLead.interactions.map((note, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{renderAuthor(note)}:</strong> {renderNote(note)}
              </div>
            ))
          ) : (
            <p>No interactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
