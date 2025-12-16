import { useEffect, useState } from "react";
import api from "../../api";

export default function LeadPond() {
  const [leads, setLeads] = useState([]);

  const loadLeads = () => {
    api.get("/leads/pond").then((res) => setLeads(res.data));
  };

  useEffect(loadLeads, []);

  const claimLead = async (id) => {
    await api.put(`/leads/${id}/claim`);
    loadLeads(); // refresh pond
  };

  return (
    <>
      <h2>Lead Pond</h2>

      {leads.length === 0 && <p>No leads available</p>}

      {leads.map((lead) => (
        <div key={lead._id} className="lead-card">
          <h4>{lead.name}</h4>
          <p>{lead.email}</p>
          <button onClick={() => claimLead(lead._id)}>
            Claim Lead
          </button>
        </div>
      ))}
    </>
  );
}
