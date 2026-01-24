import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/member/${user.id}`, {
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
  }, [user]);

  return (
    <div className="dashboard">
      <h2>Member Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <ul>
        {leads.map((lead) => (
          <li key={lead._id}>
            <span>{lead.name} — {lead.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
