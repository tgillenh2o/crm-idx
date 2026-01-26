import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // sidebar collapse

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const handleAssign = async (leadId, assignedTo) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: assignedTo }),
      });
      const updatedLead = await res.json();
      setLeads((prev) => prev.map((l) => (l._id === leadId ? updatedLead : l)));
    } catch (err) {
      console.error(err);
    }
  };

  const memberLeads = leads.filter((l) => l.assignedTo === user.email);
  const leadPondLeads = leads.filter((l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED");

  return (
    <div className="dashboard">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`main-panel ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        <AddLead onLeadAdded={(l) => setLeads([l, ...leads])} currentUser={user} isAdmin={false} users={users} />

        <div className="main-content">
          {loading ? (
            <p>Loading leads...</p>
          ) : (
            <>
              {/* Lead Pond */}
              {leadPondLeads.length > 0 && (
                <div id="lead-pond">
                  <h3 style={{ marginBottom: "8px", color: "#64b5f6" }}>Lead Pond</h3>
                  <div className="leads-grid">
                    {leadPondLeads.map((lead) => (
                      <LeadCard
                        key={lead._id}
                        lead={lead}
                        isAdmin={false} // members cannot delete
                        onAssign={handleAssign}
                        isLeadPond={true}
                        currentUserEmail={user.email}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* My Leads */}
              {memberLeads.length > 0 && (
                <div id="my-leads">
                  <h3 style={{ marginBottom: "8px" }}>My Leads</h3>
                  <div className="leads-grid">
                    {memberLeads.map((lead) => (
                      <LeadCard
                        key={lead._id}
                        lead={lead}
                        isAdmin={false} // members cannot delete
                        onAssign={handleAssign} // can move to pond
                      />
                    ))}
                  </div>
                </div>
              )}

              {leads.length === 0 && <p>No leads found.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
