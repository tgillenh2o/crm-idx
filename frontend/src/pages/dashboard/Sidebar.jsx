import React from "react";
import { Link } from "react-router-dom";
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
        <Link to="/profile" className="sidebar-item">Profile</Link>
        <Link to="/lead-pond" className="sidebar-item">Lead Pond</Link>
        <Link to="/my-leads" className="sidebar-item">My Leads</Link>
      </nav>
    </div>
  );
}
