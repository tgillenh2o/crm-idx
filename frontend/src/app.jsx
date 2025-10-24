import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { auth, teams, properties, invites, leads, setAuthToken } from "./api";
import Login from "./components/Login";
import Register from "./components/Register";
import TeamList from "./components/TeamList";
import TeamAdminPanel from "./components/TeamAdminPanel";
import InvitePanel from "./components/InvitePanel";
import PropertySearch from "./components/PropertySearch";
import PropertyList from "./components/PropertyList";
import LeadCapture from "./components/LeadCapture";

export default function App() {
  const { user, setUser, darkMode, toggleDarkMode } = useAuth();
  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [page, setPage] = useState("login"); // login/register toggle

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([teams.list(), properties.list()]);
      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    setAuthToken(null);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
        <h1>CRM + IDX</h1>
        <div>
          <button className="btn" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {user && <button className="btn" onClick={handleLogout}>Logout</button>}
        </div>
      </header>

      {!user ? (
        <div className="auth-card">
          {page === "login" ? (
            <Login switchPage={() => setPage("register")} setUser={setUser} />
          ) : (
            <Register switchPage={() => setPage("login")} setUser={setUser} />
          )}
        </div>
      ) : (
        <main>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <aside>
              <h2>Teams</h2>
              <TeamList teams={teamsData} />
              {user.role === "teamAdmin" && <TeamAdminPanel user={user} onTeamsUpdated={loadData} />}
              {user.role === "teamAdmin" && <InvitePanel user={user} onInvitesCreated={loadData} />}
            </aside>
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-primary" onClick={() => properties.sync().then(loadData)}>
                  Sync IDX
                </button>
                <span style={{ color: "#6b7280" }}>Background worker auto-syncs every X minutes</span>
              </div>

              <PropertySearch onResults={setPropertiesData} />
              <PropertyList properties={propertiesData} />

              <div style={{ marginTop: 20 }}>
                <h3>Lead Capture</h3>
                {teamsData[0] ? <LeadCapture teamId={teamsData[0]._id} /> : <div className="card">Create a team to enable lead capture.</div>}
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
