import React from "react";

export default function Sidebar({ activeTab, setActiveTab, isAdmin }) {
  return (
    <div className="sidebar">
      <div className={`sidebar-item ${activeTab === "all-leads" ? "active" : ""}`} onClick={() => setActiveTab("all-leads")}>All Leads</div>
      <div className={`sidebar-item ${activeTab === "my-leads" ? "active" : ""}`} onClick={() => setActiveTab("my-leads")}>My Leads</div>
      <div className={`sidebar-item ${activeTab === "lead-pond" ? "active" : ""}`} onClick={() => setActiveTab("lead-pond")}>Lead Pond</div>
      <div className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>Profile</div>
    </div>
  );
}
