import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("my-leads");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const leadPond = document.getElementById("lead-pond");
      const myLeads = document.getElementById("my-leads");
      const scrollY = window.scrollY + 100; // topbar offset

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

  const handleScrollLink = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // Smooth scroll with topbar offset
    const topOffset = 80; // adjust to your topbar height
    const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="sidebar">
      <h2>CRM Dashboard</h2>

      {/* Scroll links */}
      <a
        href="#lead-pond"
        className={activeSection === "lead-pond" ? "active" : ""}
        onClick={(e) => handleScrollLink(e, "lead-pond")}
      >
        Lead Pond
      </a>
      <a
        href="#my-leads"
        className={activeSection === "my-leads" ? "active" : ""}
        onClick={(e) => handleScrollLink(e, "my-leads")}
      >
        My Leads
      </a>

      {/* Profile tab */}
      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Profile
      </NavLink>

      {/* Optional: other nav */}
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
        Dashboard Home
      </NavLink>
    </div>
  );
}
