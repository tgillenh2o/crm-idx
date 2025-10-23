// frontend/src/app.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TeamList from "./components/TeamList";
import TeamAdminPanel from "./components/TeamAdminPanel";
import InvitePanel from "./components/InvitePanel";
import LeadCapture from "./components/LeadCapture";
import PropertySearch from "./components/PropertySearch";
import PropertyList from "./components/PropertyList";
import AgentLeads from "./components/AgentLeads";
import { teams, properties, leads } from "./api";

function AppInner() {
  const { user, logout } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("crm_dark") === "true"
  );

  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);

  // Dark mode effect
  useEffect(() => {
    document.body.style.background = darkMode ? "#111827" : "#f3f4f6";
    document.body.style.color = darkMode ? "#f3f4f6" : "#111827";
    localStorage.setItem("crm_dark", darkMode);
  }, [darkMode]);

  // Load dashboard data
  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    try {
      const [tRes, pRes, lRes] = await Promise.all([
        teams.list(),
        properties.list(),
        leads.list(),
      ]);
      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
      setLeadsData(lRes.data || []);
    } catch (err) {
      console.error("loadData:", err);
    }
  }

  // ---------- AUTH SCREENS ----------
  if (!user) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "60px auto",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="btn"
            style={{
              background: darkMode ? "#1f2937" : "#e5e7eb",
              color: darkMode ? "#f9fafb" : "#111827",
            }}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div
          className="card"
          style={{
            padding: 20,
            background: darkMode ? "#1f2937" : "#fff",
            boxShadow: darkMode
              ? "0 0 20px rgba(255,255,255,0.1)"
              : "0 0 12px rgba(0,0,0,0.1)",
            borderRadius: 12,
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <button
              className={`btn ${
                !showRegister ? "btn-primary" : ""
              }`}
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
            <button
              className={`btn ${showRegister ? "btn-primary" : ""}`}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>

          <div
            style={{
              marginTop: 20,
              transition: "transform 0.5s ease, opacity 0.5s ease",
            }}
          >
            {showRegister ? (
              <Register switchToLogin={() => setShowRegister(false)} />
            ) : (
              <Login switchToRegister={() => setShowRegister(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div
      className="container"
      style={{
        maxWidth: 1100,
        margin: "24px auto",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <strong>{user.name}</strong>{" "}
          <small style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
            ({user.role})
          </small>
          <div style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
            {user.email}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn"
            onClick={() => {
              navigator.clipboard.writeText(
                localStorage.getItem("crm_token") || ""
              );
              alert("Token copied");
            }}
          >
            Copy Token
          </button>
          <button className="btn" onClick={logout}>
            Logout
          </button>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="btn"
            style={{
              background: darkMode ? "#1f2937" : "#e5e7eb",
              color: darkMode ? "#f9fafb" : "#111827",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 16,
          transition: "all 0.3s ease",
        }}
      >
        <div>
          <h3>Teams</h3>
          <TeamList teams={teamsData} />
          {user.role === "teamAdmin" && (
            <TeamAdminPanel user={user} onTeamsUpdated={loadData} />
          )}
          {user.role === "teamAdmin" && (
            <InvitePanel user={user} onInvitesCreated={loadData} />
          )}
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => properties.sync().then(loadData)}
            >
              Sync IDX
            </button>
            <div style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
              Background worker auto-syncs every X minutes
            </div>
          </div>

          <PropertySearch onResults={setPropertiesData} />
          <PropertyList properties={propertiesData} />

          <div style={{ marginTop: 18 }}>
            <h3>Lead capture</h3>
            {teamsData[0] ? (
              <LeadCapture teamId={teamsData[0]._id} />
            ) : (
              <div className="card">Create a team to enable lead capture.</div>
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            <h3>Your Leads</h3>
            <AgentLeads leads={leadsData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
