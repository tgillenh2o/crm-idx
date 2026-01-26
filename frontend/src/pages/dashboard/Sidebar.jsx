import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Sidebar({ pondCount = 0, myLeadsCount = 0 }) {
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const handleScroll = () => {
      const profile = document.getElementById("profile");
      const leadPond = document.getElementById("lead-pond");
      const myLeads = document.getElementById("my-leads");
      const scrollY = window.scrollY + 120;

      if (profile && scrollY < (leadPond?.offsetTop || 0)) {
        setActiveSection("profile");
      } else if (leadPond && scrollY >= leadPond.offsetTop && scrollY < (myLeads?.offsetTop || Infinity)) {
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
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sidebar">
      <h2>CRM Dashboard</h2>

      <a
        href="#profile"
        className={activeSection === "profile" ? "active" : ""}
        onClick={(e) => { e.preventDefault(); scrollToSection("profile"); }}
      >
        Profile
      </a>

      <a
        href="#lead-pond"
        className={activeSection === "lead-pond" ? "active" : ""}
        onClick={(e) => { e.preventDefault(); scrollToSection("lead-pond"); }}
      >
        Lead Pond <span className="badge">{pondCount}</span>
      </a>

      <a
        href="#my-leads"
        className={activeSection === "my-leads" ? "active" : ""}
        onClick={(e) => { e.preventDefault(); scrollToSection("my-leads"); }}
      >
        My Leads <span className="badge">{myLeadsCount}</span>
      </a>
    </div>
  );
}
