import React, { useState } from "react";

export default function AddLead({ onLeadAdded, currentUser, isAdmin = false, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState(isAdmin ? "" : currentUser.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          status,
          assignedTo: isAdmin ? assignedTo || "POND" : currentUser.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to add lead");
        setLoading(false);
        return;
      }

      const newLead = await res.json();
      onLeadAdded(newLead);

      // reset form
      setName("");
      setEmail("");
      setPhone("");
      setStatus("New");
      if (isAdmin) setAssignedTo("");

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-lead-form-container">
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "#f44336" }}>{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Closed</option>
        </select>

        {isAdmin && (
          <input
            type="text"
            placeholder="Assign To (email or POND)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Lead"}
          </button>
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
