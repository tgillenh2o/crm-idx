import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "AT" : "AT Home Team CRM"}</h2>
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-menu">
        {/* Profile */}
        <div
          className="sidebar-item"
          onClick={() => navigate("/profile")}
        >
          Profile
        </div>

        {/* Lead Pond */}
        <div
          className="sidebar-item"
          onClick={() => navigate("/lead-pond")}
        >
          Lead Pond
        </div>

        {/* My Leads */}
        <div
          className="sidebar-item"
          onClick={() => navigate("/my-leads")}
        >
          My Leads
        </div>
      </nav>
    </div>
  );
}
