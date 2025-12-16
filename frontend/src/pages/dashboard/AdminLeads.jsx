import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/leads/all").then(res => setLeads(res.data));
    api.get("/users/team").then(res => setUsers(res.data));
  }, []);

  const assignLead = async (leadId, userId) => {
    await api.put(`/leads/${leadId}/assign`, { userId });
    const refreshed = await api.get("/leads/all");
    setLeads(refreshed.data);
  };

  return (
    <>
      <h2>Admin Lead Management</h2>

      {leads.map(lead => (
        <div key={lead._id} className="lead-card">
          <strong>{lead.name}</strong>
          <p>{lead.email}</p>

          <select
            onChange={(e) => assignLead(lead._id, e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Assign to...
            </option>

            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
}
