import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isAdmin }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CRM</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>

        {isAdmin && (
          <NavLink to="/leads" className="sidebar-link">
            All Leads
          </NavLink>
        )}

        <NavLink to="/pond" className="sidebar-link">
          Pond
        </NavLink>

        <NavLink to="/my-leads" className="sidebar-link">
          My Leads
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}
