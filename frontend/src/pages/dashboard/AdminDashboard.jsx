import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch leads");

        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error("Leads fetch error:", err);
      }
    };
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <ul>
        {leads.map((lead) => (
          <li key={lead._id}>
            <span>{lead.name} — {lead.status}</span>
            <button onClick={() => deleteLead(lead._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
