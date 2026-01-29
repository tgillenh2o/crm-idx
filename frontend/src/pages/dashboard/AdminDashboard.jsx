import { useEffect, useState } from "react";
import api from "../../api";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
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

  const reassignLead = async (id, userId) => {
    try {
      await api.patch(`/leads/${id}/reassign`, { assignedTo: userId });
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Reassign failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>All Leads</h2>

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
            <p>Assigned To: {lead.assignedTo}</p>

            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {lead.assignedTo === "POND" && (
                <button onClick={() => claimLead(lead._id)}>Claim Lead</button>
              )}
              {lead.assignedTo !== "POND" && (
                <button onClick={() => returnToPond(lead._id)}>Return to Pond</button>
              )}

              <select
                value={lead.assignedTo}
                onChange={(e) => reassignLead(lead._id, e.target.value)}
              >
                <option value="POND">POND</option>
                {users.map((u) => (
                  <option key={u._id} value={u.email}>
                    {u.name}
                  </option>
                ))}
              </select>
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
            <p>Assigned To: {selectedLead.assignedTo}</p>
            <button className="close-btn" onClick={() => setSelectedLead(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
