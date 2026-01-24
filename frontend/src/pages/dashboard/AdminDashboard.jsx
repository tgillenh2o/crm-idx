import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token"); // make sure login saves token
    fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Logged in as: {user.email}</p>
      </header>

      {error && <p className="no-leads">{error}</p>}

      {leads.length === 0 && !error ? (
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
