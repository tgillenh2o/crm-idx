import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("my-leads");

  useEffect(() => {
    const handleScroll = () => {
      const leadPond = document.getElementById("lead-pond");
      const myLeads = document.getElementById("my-leads");
      const scrollY = window.scrollY + 100; // offset for topbar

      if (leadPond && myLeads) {
        if (scrollY >= leadPond.offsetTop && scrollY < myLeads.offsetTop) {
          setActiveSection("lead-pond");
        } else if (scrollY >= myLeads.offsetTop) {
          setActiveSection("my-leads");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sidebar">
      <h2>CRM Dashboard</h2>

      <a
        href="#lead-pond"
        className={activeSection === "lead-pond" ? "active" : ""}
      >
        Lead Pond
      </a>
      <a
        href="#my-leads"
        className={activeSection === "my-leads" ? "active" : ""}
      >
        My Leads
      </a>

      {/* Other navigation if needed */}
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
        Dashboard Home
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
        Profile
      </NavLink>
    </div>
  );
}
