import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("lead-pond");

  useEffect(() => {
    const handleScroll = () => {
      const leadPond = document.getElementById("lead-pond");
      const myLeads = document.getElementById("my-leads");
      const scrollY = window.scrollY + 120;

      if (leadPond && scrollY < (myLeads?.offsetTop || Infinity)) {
        setActiveSection("lead-pond");
      } else if (myLeads && scrollY >= myLeads.offsetTop) {
        setActiveSection("my-leads");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sidebar">
      <h2>CRM Dashboard</h2>

      <a
        href="#lead-pond"
        className={activeSection === "lead-pond" ? "active" : ""}
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("lead-pond");
        }}
      >
        Lead Pond
      </a>

      <a
        href="#my-leads"
        className={activeSection === "my-leads" ? "active" : ""}
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("my-leads");
        }}
      >
        My Leads
      </a>

      {/* Profile intentionally disabled for now */}
      <span className="sidebar-disabled">Profile (coming soon)</span>
    </div>
  );
}
