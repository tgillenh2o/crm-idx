import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function AdminDashboard({ user }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Leads fetch error:", err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "contacted": return "green";
      case "pending": return "orange";
      case "new": return "blue";
      default: return "gray";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Delete lead error:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.email}</p>
      </div>

      {loading ? (
        <p>Loading all leads...</p>
      ) : leads.length === 0 ? (
        <p>No leads in the system.</p>
      ) : (
        <div className="leads-grid">
          {leads.map((lead) => (
            <div className="lead-card" key={lead._id}>
              <h3>{lead.name}</h3>
              <p>Status: <span style={{ color: getStatusColor(lead.status) }}>{lead.status}</span></p>
              <p>Assigned To: {lead.assignedToEmail || "Unassigned"}</p>
              <button onClick={() => handleDelete(lead._id)}>Delete Lead</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
