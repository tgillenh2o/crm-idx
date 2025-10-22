import React, { useEffect, useState } from "react";
import { auth, teams, properties, setAuthToken, invites, leads } from "./api";
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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    const stored = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
      setAuthToken(token);
      loadData();
    }
  }, []);

  async function loadData() {
    try {
      const [tRes, pRes] = await Promise.all([teams.list(), properties.list()]);
      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const res = await auth.login({ email, password });
      setUser(res.data.user);
      localStorage.setItem("crm_user", JSON.stringify(res.data.user));
      localStorage.setItem("crm_token", res.data.token);
      setAuthToken(res.data.token);
      loadData();
      setMessage("Login successful!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      const res = await auth.register({ name, email, password });
      setMessage(res.message || "User registered successfully!");
      setMessageType("success");
      e.target.reset();
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  }

  return (
    <div className="container">
      <h1>CRM + IDX (cloud)</h1>
      {!user ? (
        <div style={{ maxWidth: 420 }}>
          {message && (
            <div
              style={{
                padding: 8,
                marginBottom: 8,
                borderRadius: 4,
                backgroundColor: messageType === "success" ? "#d1fae5" : "#fee2e2",
                color: messageType === "success" ? "#065f46" : "#991b1b",
              }}
            >
              {message}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="card">
            <h3>Login</h3>
            <input name="email" className="input" placeholder="Email" />
            <div style={{ height: 8 }} />
            <input name="password" type="password" className="input" placeholder="Password" />
            <div style={{ height: 12 }} />
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="card" style={{ marginTop: 16 }}>
            <h3>Register</h3>
            <input name="name" className="input" placeholder="Name" />
            <div style={{ height: 8 }} />
            <input name="email" className="input" placeholder="Email" />
            <div style={{ height: 8 }} />
            <input name="password" type="password" className="input" placeholder="Password" />
            <div style={{ height: 8 }} />
            <input name="confirm" type="password" className="input" placeholder="Confirm Password" />
            <div style={{ height: 12 }} />
            <button className="btn btn-secondary" type="submit">
              Register
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <strong>{user.name}</strong> <small>({user.role})</small>
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
              {user.role === "teamAdmin" && <TeamAdminPanel user={user} onTeamsUpdated={loadData} />}
              {user.role === "teamAdmin" && <InvitePanel user={user} onInvitesCreated={loadData} />}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-primary" onClick={() => properties.sync().then(loadData)}>
                  Sync IDX
                </button>
                <div style={{ color: "#6b7280" }}>Background worker auto-syncs every X minutes</div>
              </div>

              <PropertySearch onResults={setPropertiesData} />
              <PropertyList properties={propertiesData} />

              <d
