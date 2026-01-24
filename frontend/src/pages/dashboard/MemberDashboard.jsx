import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/leads?assignedTo=${user.email}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setLeads(data))
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.email}</h1>
      </header>

      <h2>Your Leads</h2>
      {leads.length === 0 ? (
        <p className="no-leads">No leads assigned to you.</p>
      ) : (
        <ul className="leads-list">
          {leads.map(lead => (
            <li key={lead._id}>
              <span>{lead.name} — {lead.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
