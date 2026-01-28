import React from "react";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed, activeTab, setActiveTab, isAdmin=false }) {
  const menuItems = [
    { key: "profile", label: "Profile" },
    { key: "lead-pond", label: "Lead Pond" },
    { key: "my-leads", label: "My Leads" },
  ];

  // Admin could have extra menu items in the future
  if (isAdmin) {
    menuItems.push({ key: "all-leads", label: "All Leads" });
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "AT" : "AT Home Team CRM"}</h2>
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}
