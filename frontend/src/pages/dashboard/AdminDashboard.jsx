import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext); // admin user
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("lead-pond");

  // fetch all leads on load
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // update lead after claim/return/reassign
  const handleAssign = (leadId, assignedTo) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, assignedTo } : l))
    );
  };

  // delete lead
  const handleDelete = async (leadId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeads((prev) => prev.filter((l) => l._id !== leadId));
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // ====== FILTERS ======

  // Lead Pond: unassigned or in POND
  const leadPondLeads = leads.filter(
    (l) =>
      !l.assignedTo ||
      l.assignedTo.toUpperCase() === "POND" ||
      l.assignedTo.toUpperCase() === "UNASSIGNED"
  );

  // My Leads: assigned to current admin
  const myLeads = leads.filter(
    (l) => l.assignedTo?.toLowerCase() === user.email.toLowerCase()
  );

  // All Leads: all leads
  const allLeads = leads;

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={true}
      />

      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* Profile */}
        {activeTab === "profile" && <Profile />}

        {/* Lead Pond */}
        {activeTab === "lead-pond" && (
          <>
            <AddLead
              onLeadAdded={(l) => setLeads([l, ...leads])}
              currentUser={user}
              isAdmin={true}
            />

            <h3>Lead Pond</h3>

            <div className="leads-grid">
              {leadPondLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isAdmin={true}
                  currentUserEmail={user.email}
                  onAssign={handleAssign}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {/* My Leads */}
        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            <div className="leads-grid">
              {myLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isAdmin={true}
                  currentUserEmail={user.email}
                  onAssign={handleAssign}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {/* All Leads */}
        {activeTab === "all-leads" && (
          <>
            <h3>All Leads</h3>
            <div className="leads-grid">
              {allLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isAdmin={true}
                  currentUserEmail={user.email}
                  onAssign={handleAssign}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {loading && <p>Loading leads...</p>}
      </div>
    </div>
  );
}
