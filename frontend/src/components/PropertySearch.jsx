import React, { useState } from "react";

export default function PropertySearch({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/properties?search=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("crm_token")}` },
      });
      const data = await res.json();
      onResults(data);
    } catch (err) {
      alert("Search failed: " + err.message);
    }
  };

  return (
    <div className="property-search">
      <input
        type="text"
        placeholder="Search properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-secondary" onClick={handleSearch}>Search</button>
    </div>
  );
}
