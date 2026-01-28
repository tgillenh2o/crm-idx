import React from "react";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed }) {
  const sections = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "lead-pond", label: "Lead Pond", icon: "🌊" },
    { id: "my-leads", label: "My Leads", icon: "📝" },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "CRM" : "CRM IDX"}</h2>
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="sidebar-item"
            onClick={() => handleScroll(item.id)}
          >
            {item.name}
          </div>
        ))}
      </nav>
    </div>
  );
}