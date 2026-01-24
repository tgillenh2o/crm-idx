import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/api/leads?assignedTo=${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeads(data);
        } else {
          console.error("Leads fetch error:", data);
          setError(data.message || "Failed to load leads");
          setLeads([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load leads");
      });
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.email}</h1>
      </header>

      {error && <p className="no-leads">{error}</p>}

      {leads.length === 0 && !error ? (
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
