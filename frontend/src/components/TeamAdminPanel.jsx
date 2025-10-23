import React, { useState } from "react";

export default function TeamAdminPanel({ user, onTeamsUpdated }) {
  const [name, setName] = useState("");

  const handleCreateTeam = async () => {
    const token = localStorage.getItem("crm_token");
    try {
      const res = await fetch("https://crm-idx-backend.onrender.com/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(await res.text());
      setName("");
      onTeamsUpdated();
    } catch (err) {
      alert("Failed to create team: " + err.message);
    }
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h4>Create Team</h4>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Name" className="input" />
      <button onClick={handleCreateTeam} className="btn btn-primary" style={{ marginTop: 8 }}>Create</button>
    </div>
  );
}
