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
    try {
      const res = await api.get("/leads");
      // Only show member's leads + pond
      const filtered = res.data.filter(
        (l) => l.assignedTo === "POND" || l.assignedTo === res.data.currentUserEmail
      );
      setLeads(filtered);
    } catch (err) {
      console.error("Fetch leads failed:", err);
    }
  };

  const claimLead = async (id) => {
    try {
      await api.patch(`/leads/${id}/claim`);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Claim failed");
    }
  };

  const returnToPond = async (id) => {
    try {
      await api.patch(`/leads/${id}/return`);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>My Leads & Pond</h2>

      <div className="lead-list">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className={`lead-card status-${lead.status.toLowerCase().replace(" ", "_")}`}
            onClick={() => setSelectedLead(lead)}
          >
            <h3>{lead.name}</h3>
            <p>{lead.email}</p>
            <p>{lead.phone}</p>

            {lead.assignedTo === "POND" && (
              <span className="badge pond">POND</span>
            )}

            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {lead.assignedTo === "POND" && (
                <button onClick={() => claimLead(lead._id)}>Claim Lead</button>
              )}

              {lead.assignedTo !== "POND" && lead.assignedTo !== "teamAdmin" && (
                <button onClick={() => returnToPond(lead._id)}>Return to Pond</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedLead.name}</h3>
            <p>Email: {selectedLead.email}</p>
            <p>Phone: {selectedLead.phone}</p>
            <p>Status: {selectedLead.status}</p>

            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {selectedLead.assignedTo === "POND" && (
                <button onClick={() => claimLead(selectedLead._id)}>Claim Lead</button>
              )}
              {selectedLead.assignedTo !== "POND" && (
                <button onClick={() => returnToPond(selectedLead._id)}>Return to Pond</button>
              )}
            </div>

            <button className="close-btn" onClick={() => setSelectedLead(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
