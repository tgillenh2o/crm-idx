import React from "react";
import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab, isAdmin }) {
  const Item = ({ tab, label }) => (
    <button
      className={`sidebar-link ${activeTab === tab ? "active" : ""}`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CRM</h2>
      </div>

      <nav className="sidebar-nav">
        <Item tab="dashboard" label="Dashboard" />

        {isAdmin && <Item tab="all-leads" label="All Leads" />}

        <Item tab="lead-pond" label="Pond" />
        <Item tab="my-leads" label="My Leads" />
        <Item tab="profile" label="Profile" />
      </nav>
    </aside>
  );
}
