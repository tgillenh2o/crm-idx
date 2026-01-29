import React, { useState, useEffect } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  isAdmin,
  users,
  currentUserEmail,
  onUpdate,
  onClose,
}) {
  // Local editable state
  const [editableLead, setEditableLead] = useState({ ...lead });
  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState("");
  const [newInteraction, setNewInteraction] = useState("");

  // Sync local state with updated lead
  useEffect(() => {
    setEditableLead({ ...lead });
  }, [lead]);

  const triggerFlash = () => {
    setFlash(isAdmin ? "flash-admin" : "flash-member");
    setTimeout(() => setFlash(""), 800);
  };

  // Save lead changes (status, name, etc.)
  const handleSave = () => {
    const updated = { ...editableLead }; // immutable copy
    onUpdate(updated); // update dashboard
    setEditing(false);
    triggerFlash();
  };

  // Status change in dropdown
  const handleStatusChange = e => {
    const updated = { ...editableLead, status: e.target.value };
    setEditableLead(updated);
    onUpdate(updated); // update dashboard immediately
    triggerFlash();
  };

  // Input change for name, email, phone
  const handleChange = e => {
    const updated = { ...editableLead, [e.target.name]: e.target.value };
    setEditableLead(updated);
  };

  // Add new interaction
  const handleAddInteraction = () => {
    if (!newInteraction.trim()) return;
    const updated = {
      ...editableLead,
      interactions: [
        ...editableLead.interactions,
        { type: "note", note: newInteraction, date: new Date().toISOString(), createdBy: currentUserEmail },
      ],
    };
    setEditableLead(updated);
    onUpdate(updated);
    setNewInteraction("");
    triggerFlash();
  };

  // Claim from Pond
  const handleClaim = () => {
    const updated = { ...editableLead, assignedTo: currentUserEmail };
    setEditableLead(updated);
    onUpdate(updated);
    triggerFlash();
  };

  // Admin reassign
  const handleReassign = newEmail => {
    const updated = { ...editableLead, assignedTo: newEmail };
    setEditableLead(updated);
    onUpdate(updated);
    triggerFlash();
  };

  const memberCanEdit =
    !isAdmin && editableLead.assignedTo === currentUserEmail;
  const statusClass = (editableLead.status || "New")
    .toLowerCase()
    .replace(" ", "-");

  return (
    <div className="lead-modal">
      <div className={`lead-card ${flash} status-${statusClass}`}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h3>{editableLead.name}</h3>

        {(isAdmin || memberCanEdit) && editing ? (
          <div className="lead-edit-form">
            <label>
              Name:
              <input
                name="name"
                value={editableLead.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                name="email"
                value={editableLead.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                name="phone"
                value={editableLead.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Status:
              <select
                name="status"
                value={editableLead.status}
                onChange={handleStatusChange}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Follow-Up</option>
                <option>Under Contract</option>
                <option>Closed</option>
              </select>
            </label>
            <div className="form-buttons">
              <button className="claim-button" onClick={handleSave}>
                Save
              </button>
              <button
                className="return-button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="lead-details">
            <p>
              <strong>Email:</strong> {editableLead.email}
            </p>
            <p>
              <strong>Phone:</strong> {editableLead.phone}
            </p>
            <p>
              <strong>Status:</strong> {editableLead.status}
            </p>
            <p>
              <strong>Assigned To:</strong> {editableLead.assignedTo || "POND"}
            </p>

            {/* Claim for members */}
            {!isAdmin &&
              (!editableLead.assignedTo || editableLead.assignedTo === "POND") && (
                <button className="claim-button" onClick={handleClaim}>
                  Claim from Pond
                </button>
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
                    {Array.isArray(users) &&
                      users.map(u => (
                        <option key={u.email} value={u.email}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                </label>
                <button
                  className="close-button"
                  onClick={() => setEditing(true)}
                >
                  Edit Lead
                </button>
              </div>
            )}

            {/* Member edit button */}
            {memberCanEdit && !editing && (
              <button
                className="close-button"
                onClick={() => setEditing(true)}
              >
                Edit Lead
              </button>
            )}
          </div>
        )}

        {/* Interactions */}
        <div className="interaction-history">
          <h4>Interactions</h4>
          {editableLead.interactions.length > 0 ? (
            editableLead.interactions.map((note, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{note.createdBy || note.author || "User"}:</strong>{" "}
                {note.note || note.text || note}
              </div>
            ))
          ) : (
            <p>No interactions yet.</p>
          )}
          {(isAdmin || memberCanEdit) && (
            <div className="interaction-form">
              <input
                type="text"
                placeholder="Add interaction..."
                value={newInteraction}
                onChange={e => setNewInteraction(e.target.value)}
              />
              <button onClick={handleAddInteraction}>Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
