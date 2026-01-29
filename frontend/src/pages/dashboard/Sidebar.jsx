import React from "react";
import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab, isAdmin, counts = {} }) {
  const tabs = [
    { id: "all-leads", label: "All Leads", adminOnly: false },
    { id: "my-leads", label: "My Leads", adminOnly: false },
    { id: "lead-pond", label: "Lead Pond", adminOnly: false },
    { id: "profile", label: "Profile", adminOnly: false },
    // Add more admin-only tabs here if needed
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>CRM</h2>
      </div>
      <ul className="sidebar-tabs">
        {tabs.map(tab => {
          if (tab.adminOnly && !isAdmin) return null;

          const count = counts[tab.id] || 0;

          return (
            <li
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} {count > 0 && <span className="tab-count">{count}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
