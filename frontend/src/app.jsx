import React, { useState, useEffect } from "react";
import { auth, setAuthToken, teams, properties } from "./api";
import TeamList from "./components/TeamList";
import TeamAdminPanel from "./components/TeamAdminPanel";
import InvitePanel from "./components/InvitePanel";
import LeadCapture from "./components/LeadCapture";
import PropertySearch from "./components/PropertySearch";
import PropertyList from "./components/PropertyList";

export default function App() {
  const [user, setUser] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("crm_darkMode") === "true"
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
      loadData();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("crm_darkMode", darkMode);
  }, [darkMode]);

  async function loadData() {
    try {
      const [tRes, pRes] = await Promise.all([teams.list(), properties.list()]);
      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
    } catch (err) {
      console.error("❌ Load data error:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    const form = e.target;
    const name = form.name?.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      let res;
      if (isLogin) {
        res = await auth.login({ email, password });
      } else {
        res = await auth.register({ name, email, password });
      }

      setUser(res.user);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      localStorage.setItem("crm_token", res.token);
      setAuthToken(res.token);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Registration/Login failed");
    }
  }

  return (
    <div className={darkMode ? "dark container" : "container"}>
      <h1>CRM + IDX (cloud)</h1>

      {!user ? (
        <div style={{ maxWidth: 400, margin: "auto" }}>
          <div className="card" style={{ padding: 20 }}>
            <h3>{isLogin ? "Login" : "Register"}</h3>
            {errorMsg && (
              <div style={{ color: "white", background: "red", padding: 8, marginBottom: 12 }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input name="name" placeholder="Name" className="input" required />
                  <div style={{ height: 8 }} />
                </>
              )}
              <input name="email" placeholder="Email" className="input" required />
              <div style={{ height: 8 }} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input"
                required
              />
              <div style={{ height: 12 }} />
              <button type="submit" className="btn btn-primary">
                {isLogin ? "Login" : "Register"}
              </button>
            </form>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link">
                {isLogin ? "Switch to Register" : "Switch to Login"}
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn btn-secondary"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <strong>{user.name}</strong> <small>({user.role || "agent"})</small>
              <div style={{ color: "#6b7280" }}>{user.email}</div>
            </div>
            <div>
              <button
                onClick={() => {
                  localStorage.clear();
                  setUser(null);
                  setAuthToken(null);
                }}
                className="btn"
              >
                Logout
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <div>
              <h3>Teams</h3>
              <TeamList teams={teamsData} />
              {user.role === "teamAdmin" && (
                <>
                  <TeamAdminPanel user={user} onTeamsUpdated={loadData} />
                  <InvitePanel user={user} onInvitesCreated={loadData} />
                </>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-primary" onClick={() => properties.sync().then(loadData)}>
                  Sync IDX
                </button>
                <div style={{ color: "#6b7280" }}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
