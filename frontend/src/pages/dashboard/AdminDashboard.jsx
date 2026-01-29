import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../../api";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("all-leads");
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Fetch leads error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const updateLead = (updated) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === updated._id ? updated : l))
    );
    setSelectedLead(updated);
  };

  const claimLead = async (id) => {
    try {
      const res = await api.patch(`/leads/${id}/claim`);
      updateLead(res.data);
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const returnToPond = async (id) => {
    try {
      const res = await api.patch(`/leads/${id}/return`);
      updateLead(res.data);
    } catch (err) {
      console.error("Return failed:", err);
    }
  };

  const allLeads = leads;
  const myLeads = leads.filter((l) => l.assignedTo === user.email);
  const leadPond = leads.filter((l) => !l.assignedTo || l.assignedTo === "POND");

  const renderList = (list) => (
    <div className="lead-list">
      {list.map((lead) => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status.replace(" ", "_").toLowerCase()}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span>{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo || "POND"}</span>
          <span>{lead.status}</span>
          <div className="actions" onClick={(e) => e.stopPropagation()}>
            {lead.assignedTo === "POND" && (
              <button className="claim-button" onClick={() => claimLead(lead._id)}>
                Claim Lead
              </button>
            )}
            {lead.assignedTo !== "POND" && (
              <button className="return-button" onClick={() => returnToPond(lead._id)}>
                Return to Pond
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin />
      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {(activeTab === "all-leads" ||
          activeTab === "my-leads" ||
          activeTab === "lead-pond") && (
          <>
            {activeTab === "all-leads" && (
              <>
                <button
                  className="save-button"
                  onClick={() => setShowAddLead((prev) => !prev)}
                >
                  {showAddLead ? "Close Lead Form" : "+ Add Lead"}
                </button>
                {showAddLead && (
                  <AddLead
                    isAdmin
                    onLeadAdded={(lead) => {
                      setLeads([lead, ...leads]);
                      setShowAddLead(false);
                    }}
                  />
                )}
              </>
            )}

            <h3>
              {activeTab === "all-leads"
                ? "All Leads"
                : activeTab === "my-leads"
                ? "My Leads"
                : "Lead Pond"}
            </h3>

            {activeTab === "all-leads" && renderList(allLeads)}
            {activeTab === "my-leads" && renderList(myLeads)}
            {activeTab === "lead-pond" && renderList(leadPond)}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          users={users}
          isAdmin
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
