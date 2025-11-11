// src/pages/dashboard/independent/MyLeads.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function IndependentMyLeads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get("/leads/my").then((res) => setLeads(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Leads</h1>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-bold">{lead.name}</p>
              <p>Email: {lead.email}</p>
              <p>Type: {lead.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
