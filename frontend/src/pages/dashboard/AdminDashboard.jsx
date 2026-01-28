import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("lead-pond");

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
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
    } catch {
      setUsers([]);
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setLeads((prev) => prev.filter((l) => l._id !== leadId));
  };

  const handleAssign = async (leadId, assignedTo) => {
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
  };

  // Pond leads = unassigned or assigned to POND
  const leadPondLeads = leads.filter(
    (l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );

  // Leads assigned to anyone else
  const otherLeads = leads.filter((l) => !leadPondLeads.includes(l));

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin
      />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* Profile Tab */}
        {activeTab === "profile" && <Profile />}

        {/* Lead Pond */}
        {activeTab === "lead-pond" && leadPondLeads.length > 0 && (
          <>
            <AddLead
              onLeadAdded={(l) => setLeads([l, ...leads])}
              currentUser={user}
              isAdmin
              users={users}
            />
            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
            <div className="leads-grid">
              {leadPondLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isAdmin
                  onAssign={handleAssign}
                  users={users}
                  isLeadPond
                />
              ))}
            </div>
          </>
        )}

        {/* My Leads */}
        {activeTab === "my-leads" && otherLeads.length > 0 && (
          <>
            <h3>Your Leads</h3>
            <div className="leads-grid">
              {otherLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isAdmin
                  onAssign={handleAssign}
                  users={users}
                  onDelete={() => handleDelete(l._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
