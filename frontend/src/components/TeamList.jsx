import React from "react";

export default function TeamList({ teams }) {
  if (!teams.length) return <div>No teams yet</div>;
  return (
    <ul className="card">
      {teams.map((team) => (
        <li key={team._id}>
          <strong>{team.name}</strong> ({team.admin?.name || "No admin"})
        </li>
      ))}
    </ul>
  );
}
