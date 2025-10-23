import React, { useEffect, useState } from "react";
import { auth, properties, invites, leads, setAuthToken } from "./api";
import TeamList from "./components/TeamList";
import TeamAdminPanel from "./components/TeamAdminPanel";
import InvitePanel from "./components/InvitePanel";
import LeadCapture from "./components/LeadCapture";
import PropertySearch from "./components/PropertySearch";
import PropertyList from "./components/PropertyList";

export default function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [propertiesData, setPropertiesData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    const theme = localStorage.getItem("crm_theme");
    if (theme === "dark") setDarkMode(true);
    if (stored && token) {
      setUser(JSON.parse(stored));
      setAuthToken(token);
      loadData();
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("crm_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function loadData() {
    try {
      const pRes = await properties.list();
      setPropertiesData(pRes.data || []);
    } catch (err) {
      console.error("Load data error:", err);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const res = await auth.login({ email, password });
      if (res.success === false || res.error) throw new Error(res.message);
      setUser(res.data.user);
      localStorage.setItem("crm_user", JSON.stringify(res.data.user));
      localStorage.setItem("crm_token", res.data.token);
      setAuthToken(res.data.token);
      loadData();
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const role = e.target.role.value;
      const res = await auth.register({ name, email, password, role });
      if (res.success === false || res.error) throw new Error(res.message);
      alert("Registration successful. You can now log in.");
      setShowRegister(false);
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  }

  function logout() {
    localStorage.clear();
    setAuthToken(null);
    setUser(null);
  }

  return (
    <div
      className={`container ${darkMode ? "dark-mode" : "light-mode"}`}
      style={{
        minHeight: "100vh",
        padding: 24,
        background: darkMode ? "#1f2937" : "#f9fafb",
        color: darkMode ? "#f9fafb" : "#111827",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>CRM + IDX Dashboard</h1>
        <button className="btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Login / Register */}
      {!user ? (
        <div
          style={{
            maxWidth: 420,
            margin: "0 auto",
            background: darkMode ? "#374151" : "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {showRegister ? (
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              <input name="name" className="input" placeholder="Full Name" required />
              <input name="email" className="input" placeholder="Email" required />
              <input
                name="password"
                className="input"
                type="password"
                placeholder="Password"
                required
              />
              <select name="role" className="input" defaultValue="agent" required>
                <option value="agent">Agent</option>
                <option value="teamAdmin">Team Admin</option>
              </select>
              <button className="btn btn-primary" type="submit" style={{ marginTop: 10 }}>
                Register
              </button>
              <p style={{ marginTop: 12 }}>
                Already have an account?{" "}
                <span
                  style={{ color: "#3b82f6", cursor: "pointer" }}
                  onClick={() => setShowRegister(false)}
                >
                  Log in
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input name="email" className="input" placeholder="Email" required />
              <input
                name="password"
                type="password"
                className="input"
                placeholder="Password"
                required
              />
              <button className="btn btn-primary" type="submit" style={{ marginTop: 10 }}>
                Login
              </button>
              <p style={{ marginTop: 12 }}>
                Don’t have an account?{" "}
                <span
                  style={{ color: "#3b82f6", cursor: "pointer" }}
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </span>
              </p>
            </form>
          )}
        </div>
      ) : (
        /* Dashboard */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <strong>{user.name}</strong> <small>({user.role})</small>
              <div style={{ color: darkMode ? "#d1d5db" : "#6b7280" }}>{user.email}</div>
            </div>
            <div>
              <button onClick={logout} className="btn">
                Logout
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <div>
              <h3>Team Management</h3>
              <TeamList />
              {user.role === "teamAdmin" && <TeamAdminPanel user={user} />}
              {user.role === "teamAdmin" && <InvitePanel user={user} />}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => properties.sync().then(loadData)}
                >
                  Sync IDX
                </button>
                <div style={{ color: darkMode ? "#d1d5db" : "#6b7280" }}>
                  Auto-syncs every few minutes
                </div>
              </div>

              <PropertySearch onResults={setPropertiesData} />
              <PropertyList properties={propertiesData} />

              <div style={{ marginTop: 20 }}>
                <h3>Lead Capture</h3>
                <LeadCapture />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
