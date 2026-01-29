import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function MemberDashboard() {
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

  const handleLeadUpdate = (updatedLead) => {
    setLeads((prev) => {
      const exists = prev.find((l) => l._id === updatedLead._id);
      if (exists) {
        return prev.map((l) => (l._id === updatedLead._id ? updatedLead : l));
      } else {
        return [updatedLead, ...prev];
      }
    });
  };

  const leadPondLeads = leads.filter(
    (l) =>
      !l.assignedTo ||
      l.assignedTo.toUpperCase() === "POND" ||
      l.assignedTo.toUpperCase() === "UNASSIGNED"
  );

  const myLeads = leads.filter((l) => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={false}
      />

      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {activeTab === "profile" && <Profile />}

        {/* Lead Pond */}
        {activeTab === "lead-pond" && (
          <>
            {!showAddLeadForm && (
              <button
                className="add-lead-button"
                onClick={() => setShowAddLeadForm(true)}
              >
                + Add Lead
              </button>
            )}

            {showAddLeadForm && (
              <div className="add-lead-form-container">
                <AddLead
                  currentUser={user}
                  isAdmin={false}
                  onLeadAdded={(lead) => {
                    handleLeadUpdate(lead);
                    setShowAddLeadForm(false);
                  }}
                />
                <button
                  className="cancel-button"
                  onClick={() => setShowAddLeadForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            <h3>Lead Pond</h3>
            <div className="leads-grid">
              {leadPondLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isLeadPond
                  currentUserEmail={user.email}
                  onAssign={handleLeadUpdate}
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
                  currentUserEmail={user.email}
                  onAssign={handleLeadUpdate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
