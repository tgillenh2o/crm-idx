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
  const [activeTab, setActiveTab] = useState("all-leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  /* =======================
     Data Fetching
  ======================== */
  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const updateLeadAssignment = (leadId, assignedTo) => {
    setLeads(prev =>
      prev.map(lead =>
        lead._id === leadId ? { ...lead, assignedTo } : lead
      )
    );
    setSelectedLead(null);
  };

  /* =======================
     Lead Filters
  ======================== */
  const allLeads = leads;

  const myLeads = leads.filter(l => l.assignedTo === user.email);

  const leadPond = leads.filter(
    l =>
      !l.assignedTo ||
      l.assignedTo === "POND" ||
      l.assignedTo === "UNASSIGNED"
  );

  /* =======================
     Shared Lead List UI
  ======================== */
  const renderLeadList = list => (
    <div className="lead-list">
      {list.length === 0 && (
        <p className="empty-state">No leads found.</p>
      )}

      {list.map(lead => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status.toLowerCase()}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span className="lead-name">{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo || "POND"}</span>
          <span>{lead.status}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin
      />

      <div className="main-panel">
        <Topbar />

        {/* ===== PROFILE ===== */}
        {activeTab === "profile" && (
          <Profile />
        )}

        {/* ===== ALL LEADS ===== */}
        {activeTab === "all-leads" && (
          <>
            <div className="dashboard-header">
              <h3>All Leads</h3>

              <button
                className="add-lead-btn"
                onClick={() => setShowAddLead(prev => !prev)}
              >
                {showAddLead ? "Close Form" : "+ Add Lead"}
              </button>
            </div>

            {showAddLead && (
              <AddLead
                isAdmin
                onLeadAdded={lead => {
                  setLeads(prev => [lead, ...prev]);
                  setShowAddLead(false);
                }}
              />
            )}

            {renderLeadList(allLeads)}
          </>
        )}

        {/* ===== LEAD POND ===== */}
        {activeTab === "lead-pond" && (
          <>
            <h3>Lead Pond</h3>
            {renderLeadList(leadPond)}
          </>
        )}

        {/* ===== MY LEADS ===== */}
        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            {renderLeadList(myLeads)}
          </>
        )}
      </div>

      {/* ===== LEAD DETAILS MODAL ===== */}
      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin
          users={users}
          currentUserEmail={user.email}
          onAssign={updateLeadAssignment}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
