import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { auth, teams, properties } from "./api";

import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";
import TeamAdminPanel from "./components/TeamAdminPanel";
import TeamList from "./components/TeamList";
import PropertyList from "./components/PropertyList";
import PropertySearch from "./components/PropertySearch";

export default function App() {
  const { user, logoutUser } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);

  const loadData = async () => {
    try {
      const [teamRes, propRes] = await Promise.all([teams.list(), properties.list()]);
      setTeamsData(teamRes.data || []);
      setPropertiesData(propRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="container">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>CRM + IDX</h1>
          <div>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            {user && <button onClick={logoutUser}>Logout</button>}
          </div>
        </header>

        {!user ? (
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            {showRegister ? (
              <RegisterForm onToggle={() => setShowRegister(false)} />
            ) : (
              <LoginForm onToggle={() => setShowRegister(true)} />
            )}
          </div>
        ) : (
          <main>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
              <div>
                <h2>Teams</h2>
                <TeamList teams={teamsData} />
                {user.role === "teamAdmin" && <TeamAdminPanel onTeamsUpdated={loadData} />}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => properties.sync().then(loadData)}>Sync IDX</button>
                  <span>Auto-sync every few minutes</span>
                </div>
                <PropertySearch onResults={setPropertiesData} />
                <PropertyList properties={propertiesData} />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
