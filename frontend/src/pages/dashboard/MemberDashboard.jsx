import { useEffect, useState } from "react";
import api from "../../api";
import "./Dashboard.css";

export default function MemberDashboard() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await api.get("/leads");
    setLeads(res.data);
  };

  const claimLead = async (id) => {
    await api.patch(`/leads/${id}/claim`);
    fetchLeads();
  };

  const returnToPond = async (id) => {
    await api.patch(`/leads/${id}/return`);
    fetchLeads();
  };

  return (
    <div className="dashboard">
      <h2>My Leads & Pond</h2>

      <div className="lead-list">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="lead-card"
            onClick={() => setSelectedLead(lead)}
          >
            <h3>{lead.name}</h3>
            <p>{lead.email}</p>

            {lead.assignedTo === "POND" && (
              <span className="badge pond">POND</span>
            )}

            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {lead.assignedTo === "POND" && (
                <button onClick={() => claimLead(lead._id)}>
                  Claim Lead
                </button>
              )}

              {lead.assignedTo !== "POND" && (
                <button onClick={() => returnToPond(lead._id)}>
                  Return to Pond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedLead.name}</h3>
            <p>Status: {selectedLead.status}</p>
            <button onClick={() => setSelectedLead(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
