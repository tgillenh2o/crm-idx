import React, { useState } from "react";

export default function AddLead({ onLeadAdded, currentUser, isAdmin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState(isAdmin ? "" : currentUser.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

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
          assignedTo: isAdmin ? assignedTo : currentUser.email, // auto-assign for member
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onLeadAdded(data);
        setName("");
        setEmail("");
        setPhone("");
        setStatus("New");
        if (isAdmin) setAssignedTo("");
      } else {
        console.error("Failed to add lead:", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="add-lead-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>New</option>
        <option>Contacted</option>
        <option>Follow-up</option>
        <option>Closed</option>
      </select>

      {/* Admin can choose assignee */}
      {isAdmin && (
        <input
          type="text"
          placeholder="Assign to (email)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
      )}

      <button type="submit">{isAdmin ? "Add Lead" : "Add & Assign to Me"}</button>
    </form>
  );
}
