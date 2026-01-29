import React, { useState } from "react";

export default function AddLead({ isAdmin, users = [], onLeadAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState("POND");

  const submit = async () => {
    if (!name || !email) return alert("Name and Email required");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ name, email, phone, status, assignedTo }),
    });
    const data = await res.json();
    onLeadAdded(data);
    setName(""); setEmail(""); setPhone(""); setStatus("New"); setAssignedTo("POND");
  };

  return (
    <div className="add-lead-form">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {["New", "Contacted", "Follow-up", "Under Contract", "Closed"].map((s) => <option key={s}>{s}</option>)}
      </select>
      {isAdmin && (
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="POND">POND</option>
          {users.map((u) => <option key={u.email} value={u.email}>{u.name}</option>)}
        </select>
      )}
      <button onClick={submit}>Add Lead</button>
    </div>
  );
}
