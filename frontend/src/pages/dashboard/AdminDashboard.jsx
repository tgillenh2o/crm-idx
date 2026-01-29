import { useEffect, useState } from "react";
import api from "../../api";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const leadsRes = await api.get("/leads");
    const usersRes = await api.get("/users");
    setLeads(leadsRes.data);
    setUsers(usersRes.data);
  };

  const reassignLead = async (leadId, email) => {
    await api.patch(`/leads/${leadId}/assign`, { assignedTo: email });
    fetchAll();
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      <div className="lead-list">
        {leads.map((lead) => (
          <div key={lead._id} className="lead-card">
            <h3>{lead.name}</h3>
            <p>{lead.email}</p>
            <p>Assigned: {lead.assignedTo}</p>

            <select
              onChange={(e) =>
                reassignLead(lead._id, e.target.value)
              }
              defaultValue=""
            >
              <option value="" disabled>
                Reassign Lead
              </option>
              <option value="POND">POND</option>
              {users.map((u) => (
                <option key={u._id} value={u.email}>
                  {u.email}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
