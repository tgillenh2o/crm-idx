import React from "react";
import "./Dashboard.css";
import { FaUser, FaUsers, FaClipboardList, FaBars } from "react-icons/fa";

export default function Sidebar({ collapsed, setCollapsed }) {
  const sections = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "lead-pond", label: "Lead Pond", icon: <FaUsers /> },
    { id: "my-leads", label: "My Leads", icon: <FaClipboardList /> },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>CRM Dashboard</h2>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>

      <div className="sidebar-links">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="sidebar-link"
            onClick={() => scrollToSection(sec.id)}
          >
            <span className="icon">{sec.icon}</span>
            {!collapsed && <span className="label">{sec.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
