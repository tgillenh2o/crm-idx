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
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("lead-pond");
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);

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

  const handleAssign = (leadId, assignedTo) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, assignedTo } : l))
    );
  };

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

  // ===== FILTERS =====
  const leadPondLeads = leads.filter(
    (l) =>
      !l.assignedTo ||
      l.assignedTo.toUpperCase() === "POND" ||
      l.assignedTo.toUpperCase() === "UNASSIGNED"
  );

  const myLeads = leads.filter(
    (l) => l.assignedTo?.toLowerCase() === user.email.toLowerCase()
  );

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

        {/* ===== LEAD POND ===== */}
        {activeTab === "lead-pond" && (
          <>
            {/* Add Lead Toggle */}
            {!showAddLeadForm && (
              <button
                className="add-lead-button"
                onClick={() => setShowAddLeadForm(true)}
              >
                + Add Lead
              </button>
            )}

            {showAddLeadForm && (
              <AddLead
                currentUser={user}
                isAdmin={true}
                onLeadAdded={(l) => {
                  setLeads([l, ...leads]);
                  setShowAddLeadForm(false);
                }}
                onCancel={() => setShowAddLeadForm(false)}
              />
            )}

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

        {/* ===== MY LEADS ===== */}
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

        {/* ===== ALL LEADS ===== */}
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
