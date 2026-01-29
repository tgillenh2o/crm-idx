// Sidebar.jsx
import React from "react";

export default function Sidebar({ activeTab, setActiveTab, isAdmin }) {
  const tabs = [
    { key: "all-leads", label: "All Leads", adminOnly: true },
    { key: "my-leads", label: "My Leads" },
    { key: "lead-pond", label: "Lead Pond" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-scroll">
        {tabs.map(
          (tab) =>
            (isAdmin || !tab.adminOnly) && (
              <button
                key={tab.key}
                className={`sidebar-button ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            )
        )}
      </div>
    </div>
  );
}
