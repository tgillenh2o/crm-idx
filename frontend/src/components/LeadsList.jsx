import axios from "axios";
import { useEffect, useState } from "react";

export default function LeadsList({ canDelete }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLeads(res.data);
    };

    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (!canDelete) return;

    const token = localStorage.getItem("token");
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/leads/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setLeads(leads.filter(l => l._id !== id));
  };

  return (
    <ul>
      {leads.map(lead => (
        <li key={lead._id}>
          {lead.name} – {lead.email}

          {canDelete && (
            <button onClick={() => deleteLead(lead._id)}>
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
