import React from "react";
import "./Sidebar.css";

export default function Sidebar({
  collapsed,
  setCollapsed,
  activeTab,
  setActiveTab,
  isAdmin = false,
}) {
  // Base menu items
  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "lead-pond", label: "Lead Pond" },
    { id: "my-leads", label: "My Leads" },
  ];

  // Add "All Leads" for admins
  if (isAdmin) {
    menuItems.push({ id: "all-leads", label: "All Leads" });
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "AT" : "AT Home Team CRM"}</h2>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}
