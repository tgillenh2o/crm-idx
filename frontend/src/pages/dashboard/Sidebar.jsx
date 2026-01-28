import React from "react";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "AT" : "AT Home Team CRM"}</h2>
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-menu">
        <div className="sidebar-item">Profile</div>
        <div className="sidebar-item">Lead Pond</div>
        <div className="sidebar-item">My Leads</div>
      </nav>
    </div>
  );
}
