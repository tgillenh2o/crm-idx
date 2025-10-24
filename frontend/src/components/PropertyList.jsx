import React from "react";

export default function PropertyList({ properties }) {
  if (!properties.length) return <div>No properties found.</div>;

  return (
    <ul className="property-list">
      {properties.map((p) => (
        <li key={p._id}>
          <strong>{p.address}</strong> - ${p.price.toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
