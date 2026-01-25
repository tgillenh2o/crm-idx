import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all leads
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

  // Fetch all users
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

  // Delete lead
  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeads((prev) => prev.filter((l) => l._id !== leadId));
    } catch (err) {
      console.error(err);
    }
  };

  // Assign/Reassign lead
  const handleAssign = async (leadId, userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });
      const updatedLead = await res.json();
      setLeads((prev) => prev.map((l) => (l._id === leadId ? updatedLead : l)));
    } catch (err) {
      console.error(err);
    }
  };

  // Separate Lead Pond (unassigned) and other leads
  const leadPondLeads = leads.filter((l) => !l.assignedTo || l.assignedTo === "POND");
  const otherLeads = leads.filter((l) => !leadPondLeads.includes(l));

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-panel">
        <Topbar />

        {/* Stats */}
        <div className="stats-cards">
          <div className="stat-card">
            <p>Total Leads</p>
            <h3>{leads.length}</h3>
          </div>
          <div className="stat-card">
            <p>Follow-ups</p>
            <h3>{leads.filter((l) => l.status === "Follow-up").length}</h3>
          </div>
          <div className="stat-card">
            <p>Contacted</p>
            <h3>{leads.filter((l) => l.status === "Contacted").length}</h3>
          </div>
        </div>

        {/* Add Lead Form */}
        <AddLead onLeadAdded={(l) => setLeads([l, ...leads])} currentUser={user} isAdmin={true} users={users} />

        {/* Leads Sections */}
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
                        isAdmin={true}
                        onDelete={handleDelete}
                        users={users}
                        onAssign={handleAssign}
                        isLeadPond={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* My Leads */}
              {otherLeads.length > 0 && (
                <div id="my-leads">
                  <h3 style={{ marginBottom: "8px" }}>Your Leads</h3>
                  <div className="leads-grid">
                    {otherLeads.map((lead) => (
                      <LeadCard
                        key={lead._id}
                        lead={lead}
                        isAdmin={true}
                        onDelete={handleDelete}
                        users={users}
                        onAssign={handleAssign}
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
