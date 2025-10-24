import React, { useState } from "react";

export default function TeamAdminPanel({ user, onTeamsUpdated }) {
  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = async () => {
    if (!teamName) return;
    try {
      await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("crm_token")}`,
        },
        body: JSON.stringify({ name: teamName }),
      });
      setTeamName("");
      onTeamsUpdated();
    } catch (err) {
      alert("Error creating team: " + err.message);
    }
  };

  return (
    <div className="card team-admin-panel">
      <h4>Admin Panel</h4>
      <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="New Team Name" />
      <button className="btn btn-primary" onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
}
