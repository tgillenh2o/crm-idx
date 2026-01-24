import { useEffect, useState } from "react";

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

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>

      {loading ? (
        <p>Loading all leads...</p>
      ) : leads.length === 0 ? (
        <p>No leads in the system.</p>
      ) : (
        <ul>
          {leads.map((lead) => (
            <li key={lead._id}>
              {lead.name} — {lead.status} — Assigned to: {lead.assignedToEmail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
