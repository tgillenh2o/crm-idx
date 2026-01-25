import React from "react";
import { NavLink } from "react-router-dom";
<a href="#lead-pond">Lead Pond</a>
<a href="#my-leads">My Leads</a>


export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CRM Dashboard</h2>
      <NavLink to="/dashboard" end>
        Dashboard
      </NavLink>
      <NavLink to="/dashboard/leads">My Leads</NavLink>
      <NavLink to="/dashboard/lead-pond">Lead Pond</NavLink>
    </div>
  );
}
