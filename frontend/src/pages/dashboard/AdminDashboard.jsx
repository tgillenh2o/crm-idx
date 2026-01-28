import React, { useContext, useEffect, useState, useRef } from "react";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Refs for scroll
  const profileRef = useRef(null);
  const leadPondRef = useRef(null);
  const myLeadsRef = useRef(null);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeads([]);
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
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeads(leads.filter((l) => l._id !== leadId));
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

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
      console.error("Failed to assign lead:", err);
    }
  };

  const leadPondLeads = leads.filter(
    (l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );
  const myLeads = leads.filter((l) => !leadPondLeads.includes(l));

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        scrollRefs={{
          profile: profileRef,
          leadPond: leadPondRef,
          myLeads: myLeadsRef,
        }}
      />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* PROFILE SECTION */}
        <div ref={profileRef} id="profile">
          <Profile />
        </div>

        {/* ADD LEAD FORM */}
        <AddLead
          onLeadAdded={(newLead) => setLeads([newLead, ...leads])}
          currentUser={user}
          isAdmin={true}
          users={users}
        />

        {/* LEAD POND */}
        <div ref={leadPondRef} id="lead-pond">
          {leadPondLeads.length > 0 && (
            <>
              <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
              <div className="leads-grid">
                {leadPondLeads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    isAdmin
                    onAssign={handleAssign}
                    users={users}
                    isLeadPond
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* MY LEADS */}
        <div ref={myLeadsRef} id="my-leads">
          {myLeads.length > 0 && (
            <>
              <h3>My Leads</h3>
              <div className="leads-grid">
                {myLeads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    isAdmin
                    onAssign={handleAssign}
                    users={users}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
