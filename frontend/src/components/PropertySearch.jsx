import React, { useState } from "react";

export default function PropertySearch({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("crm_token");
      const res = await fetch(`https://crm-idx-backend.onrender.com/api/properties/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onResults(data.data || []);
    } catch (err) {
      alert("Search failed: " + err.message);
    }
  };

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search properties..." className="input" />
      <button onClick={handleSearch} className="btn btn-primary" style={{ marginTop: 8 }}>Search</button>
    </div>
  );
}
