import React from "react";
import "./Dashboard.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">AT Home Team CRM</h1>
      </div>

      <div className="topbar-right">
        {/* reserved for future: search, notifications, user menu */}
      </div>
    </div>
  );
}
