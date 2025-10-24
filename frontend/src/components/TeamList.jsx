import React from "react";

export default function TeamList({ teams }) {
  if (!teams.length) return <div>No teams available.</div>;
  return (
    <ul className="team-list">
      {teams.map((t) => (
        <li key={t._id}>{t.name}</li>
      ))}
    </ul>
  );
}
