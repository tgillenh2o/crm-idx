import React from "react";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed, scrollRefs }) {
  const menuItems = [
    { name: "Profile", id: "profile" },
    { name: "Lead Pond", id: "lead-pond" },
    { name: "My Leads", id: "my-leads" },
  ];

  const handleScroll = (id) => {
    if (scrollRefs && scrollRefs[id] && scrollRefs[id].current) {
      scrollRefs[id].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "AT" : "AT Home Team CRM"}</h2>
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
