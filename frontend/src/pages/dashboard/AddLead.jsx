import React, { useState } from "react";
import "./Dashboard.css";

export default function AddLead({ onLeadAdded, currentUser, isAdmin = false, users = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState(isAdmin ? "" : currentUser.email);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          assignedTo: isAdmin ? assignedTo : currentUser.email,
        }),
      });

      const newLead = await res.json();
      onLeadAdded(newLead);

      setName(""); setEmail(""); setPhone(""); setStatus("New"); setAssignedTo(isAdmin ? "" : currentUser.email);
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="add-lead-container">
      <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Lead"}
      </button>

      {showForm && (
        <form className="add-lead-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="form-row">
            <select value={status} onChange={e => setStatus(e.target.value)} required>
              <option>New</option>
              <option>Contacted</option>
              <option>Follow-up</option>
              <option>Closed</option>
            </select>

            {isAdmin && users.length > 0 && (
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                <option value="">Unassigned</option>
                <option value="POND">Lead Pond</option>
                {users.map(u => <option key={u._id} value={u.email}>{u.name}</option>)}
              </select>
            )}
          </div>

          <button className="submit-lead-btn" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Lead"}
          </button>
        </form>
      )}
    </div>
  );
}
