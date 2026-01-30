import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isAdmin }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>CRM</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          📋 My Leads
        </NavLink>

        <NavLink
          to="/pond"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          🐟 Lead Pond
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            🛠 Admin
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          ⚙️ Settings
        </NavLink>

        <NavLink to="/logout" className="sidebar-link logout">
          🚪 Logout
        </NavLink>
      </div>
    </aside>
  );
}
