import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/leads`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setLeads(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setLeads(prev => prev.filter(l => l._id !== id));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <h2>All Leads</h2>
      {leads.length === 0 ? (
        <p className="no-leads">No leads available.</p>
      ) : (
        <ul className="leads-list">
          {leads.map(lead => (
            <li key={lead._id}>
              <span>{lead.name} — {lead.status}</span>
              <button onClick={() => handleDelete(lead._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
