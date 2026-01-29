import React, { useState, useEffect } from "react";
import "./LeadCard.css";

export default function LeadCard({ lead, isAdmin, users, currentUserEmail, onUpdate, onClose }) {
  const [editableLead, setEditableLead] = useState({ ...lead });
  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setEditableLead({ ...lead });
  }, [lead]);

  // Flash animation on update
  const triggerFlash = () => {
    setFlash(isAdmin ? "flash-admin" : "flash-member");
    setTimeout(() => setFlash(""), 800);
  };

  const handleChange = e => {
    setEditableLead({ ...editableLead, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(editableLead);
    setEditing(false);
    triggerFlash();
  };

  const handleClaim = () => {
    const updated = { ...editableLead, assignedTo: currentUserEmail };
    onUpdate(updated);
    triggerFlash();
  };

  const handleReassign = newEmail => {
    const updated = { ...editableLead, assignedTo: newEmail };
    onUpdate(updated);
    triggerFlash();
  };

  // Determine if member can edit this lead
  const memberCanEdit = !isAdmin && editableLead.assignedTo === currentUserEmail;

  return (
    <div className="lead-modal">
      <div className={`lead-card ${flash} status-${editableLead.status.toLowerCase().replace(" ", "-")}`}>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>×</button>

        {/* Lead Name */}
        <h3>{editableLead.name}</h3>

        {/* Editable Fields */}
        {(isAdmin || memberCanEdit) && editing ? (
          <div className="lead-edit-form">
            <label>
              Name: <input name="name" value={editableLead.name} onChange={handleChange} />
            </label>
            <label>
              Email: <input name="email" value={editableLead.email} onChange={handleChange} />
            </label>
            <label>
              Phone: <input name="phone" value={editableLead.phone} onChange={handleChange} />
            </label>
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

            {/* Claim from Pond for members */}
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
                    {users.map(u => (
                      <option key={u.email} value={u.email}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </label>
                <button className="close-button" onClick={() => setEditing(true)}>Edit Lead</button>
              </div>
            )}

            {/* Member edit button if allowed */}
            {memberCanEdit && !editing && (
              <button className="close-button" onClick={() => setEditing(true)}>Edit Lead</button>
            )}
          </div>
        )}

        {/* Interaction History */}
        <div className="interaction-history">
          <h4>Interactions</h4>
          {editableLead.interactions?.length > 0 ? (
            editableLead.interactions.map((note, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{note.author || "User"}:</strong> {note.text || note}
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
