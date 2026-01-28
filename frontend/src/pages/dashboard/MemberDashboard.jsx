import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("lead-pond"); // default tab

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

  // Leads in the pond = unassigned + POND
  const leadPondLeads = leads.filter(
    (l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );

  // Leads assigned to this member
  const myLeads = leads.filter((l) => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* Profile Tab */}
        {activeTab === "profile" && <Profile />}

        {/* Lead Pond Tab */}
        {activeTab === "lead-pond" && (
          <>
            {/* Members can add new leads */}
            <AddLead
              onLeadAdded={(l) => setLeads([l, ...leads])}
              currentUser={user}
              isAdmin={false} // member adding
              users={users}
            />

            {leadPondLeads.length > 0 ? (
              <>
                <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
                <div className="leads-grid">
                  {leadPondLeads.map((l) => (
                    <LeadCard
                      key={l._id}
                      lead={l}
                      currentUserEmail={user.email}
                      isLeadPond
                      onAssign={handleAssign}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p>No leads in the pond.</p>
            )}
          </>
        )}

        {/* My Leads Tab */}
        {activeTab === "my-leads" && (
          <>
            {myLeads.length > 0 ? (
              <>
                <h3>My Leads</h3>
                <div className="leads-grid">
                  {myLeads.map((l) => (
                    <LeadCard
                      key={l._id}
                      lead={l}
                      currentUserEmail={user.email}
                      onAssign={handleAssign}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p>You have no assigned leads yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
