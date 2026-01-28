import React from "react";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed, activeTab, setActiveTab }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "AT" : "AT Home Team CRM"}</h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="collapse-btn"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-menu">
        <div
          className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </div>
        <div
          className={`sidebar-item ${activeTab === "lead-pond" ? "active" : ""}`}
          onClick={() => setActiveTab("lead-pond")}
        >
          Lead Pond
        </div>
        <div
          className={`sidebar-item ${activeTab === "my-leads" ? "active" : ""}`}
          onClick={() => setActiveTab("my-leads")}
        >
          My Leads
        </div>
      </nav>
    </div>
  );
}
