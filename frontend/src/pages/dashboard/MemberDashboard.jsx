import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function MemberDashboard({ user }) {
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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Member Dashboard</h1>
        <p>Welcome, {user.email}</p>
      </div>

      {loading ? (
        <p>Loading your leads...</p>
      ) : leads.length === 0 ? (
        <p>You have no leads assigned.</p>
      ) : (
        <div className="leads-grid">
          {leads.map((lead) => (
            <div className="lead-card" key={lead._id}>
              <h3>{lead.name}</h3>
              <p>Status: <span style={{ color: getStatusColor(lead.status) }}>{lead.status}</span></p>
              <p>Assigned To: {lead.assignedToEmail || "Unassigned"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
