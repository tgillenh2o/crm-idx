import React from "react";

export default function PropertyList({ properties }) {
  if (!properties.length) return <div>No properties</div>;
  return (
    <ul className="card" style={{ marginTop: 8 }}>
      {properties.map((p) => (
        <li key={p._id}>{p.address} - ${p.price}</li>
      ))}
    </ul>
  );
}
