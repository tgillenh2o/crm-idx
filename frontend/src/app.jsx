import React, { useEffect, useState, useRef } from "react";
import { auth, teams, properties, leads, setAuthToken } from "./api";
import TeamList from "./components/TeamList";
import TeamAdminPanel from "./components/TeamAdminPanel";
import InvitePanel from "./components/InvitePanel";
import LeadCapture from "./components/LeadCapture";
import AgentLeads from "./components/AgentLeads"; // We'll create a simplified agent-only dashboard
import PropertySearch from "./components/PropertySearch";
import PropertyList from "./components/PropertyList";

// ------------------ Helpers ------------------
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const passwordStrength = (password) => {
  if (!password) return "";
  if (password.length < 6) return "Weak";
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "Strong";
  return "Medium";
};

export default function App() {
  const [user, setUser] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [userLeads, setUserLeads] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [activeTab, setActiveTab] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordStrengthText, setPasswordStrengthText] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const firstInputRef = useRef(null);

  // ------------------ Auto-focus input on tab switch ------------------
  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
    setMessage("");
  }, [activeTab]);

  // ------------------ Load User from LocalStorage ------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
      loadData(token);
    }
  }, []);

  // ------------------ Load Teams, Properties & Leads ------------------
  async function loadData(token) {
    setMessage("");
    try {
      const [tRes, pRes, lRes] = await Promise.all([
        teams.list(token),
        properties.list(token),
        leads.list(token),
      ]);

      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
      setUserLeads(lRes.data || []);
    } catch (err) {
      console.error("Load data error:", err);
      setMessage("Load failed: " + (err.message || "Unknown error"));
      setMessageType("error");
    }
  }

  // ------------------ Login ------------------
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    try {
      const res = await auth.login({ email, password });
      if (res.message && res.message.toLowerCase().includes("invalid")) {
        setMessage(res.message);
        setMessageType("error");
        return;
      }
      setUser(res.data.user);
      localStorage.setItem("crm_user", JSON.stringify(res.data.user));
      localStorage.setItem("crm_token", res.data.token);
      setAuthToken(res.data.token);
      loadData(res.data.token);

      setMessage("Login successful!");
      setMessageType("success");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.message || "Login failed");
      setMessageType("error");
    }
  }

  // ------------------ Register ------------------
  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (!validateEmail(email)) {
      setMessage("Invalid email format");
      setMessageType("error");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      const res = await auth.register({ name, email, password });
      if (res.message) {
        setMessage(res.message);
        setMessageType(res.message.toLowerCase().includes("successful") ? "success" : "error");
      }
      if (res.message && res.message.toLowerCase().includes("successful")) {
        e.target.reset();
        setActiveTab("login");
      }
    } catch (err) {
      console.error("Register error:", err);
      setMessage(err.message || "Registration failed");
      setMessageType("error");
    }
  }

  // ------------------ Logout ------------------
  function handleLogout() {
    localStorage.clear();
    setUser(null);
    setAuthToken(null);
    setTeamsData([]);
    setPropertiesData([]);
    setUserLeads([]);
    setMessage("");
  }

  // ------------------ Copy token to clipboard ------------------
  const copyToken = () => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      navigator.clipboard.writeText(token);
      setMessage("Token copied to clipboard!");
      setMessageType("success");
    }
  };

  // ------------------ JSX ------------------
  return (
    <div className={darkMode ? "dark" : ""} style={{ background: darkMode ? "#111827" : "#f9fafb", minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 24, color: darkMode ? "#f9fafb" : "#111827" }}>CRM + IDX (cloud)</h1>

        {/* Dark Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: 6, borderRadius: 4, cursor: "pointer" }}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {!user ? (
          <div>
            {/* Message */}
            {message && (
              <div
                style={{
                  padding: 10,
                  marginBottom: 16,
                  borderRadius: 6,
                  backgroundColor: messageType === "success" ? "#d1fae5" : "#fee2e2",
                  color: messageType === "success" ? "#065f46" : "#991b1b",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {message}
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: 16, borderRadius: 6, overflow: "hidden", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}>
              <button
                onClick={() => setActiveTab("login")}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: activeTab === "login" ? "#2563eb" : "#e5e7eb",
                  color: activeTab === "login" ? "#fff" : "#111827",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: activeTab === "register" ? "#2563eb" : "#e5e7eb",
                  color: activeTab === "register" ? "#fff" : "#111827",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Register
              </button>
            </div>

            {/* Forms */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: darkMode ? "#1f2937" : "#fff" }}>
                <input ref={firstInputRef} name="email" type="email" placeholder="Email" required style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }} />
                <div style={{ position: "relative" }}>
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db", width: "100%" }} />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 8, top: 8, cursor: "pointer", fontSize: 12, color: "#6b7280" }}>
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                <button type="submit" style={{ padding: 10, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Login</button>
              </form>
            )}

            {activeTab === "register" && (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: darkMode ? "#1f2937" : "#fff" }}>
                <input ref={firstInputRef} name="name" placeholder="Name" required style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmailValid(validateEmail(e.target.value))}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
                />
                {!emailValid && <div style={{ color: "#991b1b", fontSize: 12 }}>Invalid email format</div>}

                <div style={{ position: "relative" }}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    onChange={(e) => {
                      setPasswordStrengthText(passwordStrength(e.target.value));
                      setPasswordMatch(e.target.value === document.querySelector("input[name='confirm']").value);
                    }}
                    style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db", width: "100%" }}
                  />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 8, top: 8, cursor: "pointer", fontSize: 12, color: "#6b7280" }}>
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {passwordStrengthText && <div style={{ fontSize: 12, color: "#6b7280" }}>Strength: {passwordStrengthText}</div>}

                <div style={{ position: "relative" }}>
                  <input
                    name="confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    onChange={(e) => setPasswordMatch(e.target.value === document.querySelector("input[name='password']").value)}
                    style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db", width: "100%" }}
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: 8, top: 8, cursor: "pointer", fontSize: 12, color: "#6b7280" }}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {!passwordMatch && <div style={{ color: "#991b1b", fontSize: 12 }}>Passwords do not match</div>}

                <button type="submit" disabled={!emailValid || !passwordMatch} style={{ padding: 10, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Register</button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* Logged-in header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <strong style={{ color: darkMode ? "#f9fafb" : "#111827" }}>{user.name}</strong>{" "}
                <small style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>({user.role})</small>
                <div style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>{user.email}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={copyToken} style={{ padding: 6, borderRadius: 4, cursor: "pointer" }}>Copy Token</button>
                <button onClick={handleLogout} style={{ padding: 6, borderRadius: 4, cursor: "pointer" }}>Logout</button>
              </div>
            </div>

            {/* Admin vs Agent dashboard */}
            {user.role === "teamAdmin" ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                <div>
                  <h3>Teams</h3>
                  <TeamList teams={teamsData} />
                  <TeamAdminPanel user={user} onTeamsUpdated={() => loadData(localStorage.getItem("crm_token"))} />
                  <InvitePanel user={user} onInvitesCreated={() => loadData(localStorage.getItem("crm_token"))} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <button className="btn btn-primary" onClick={() => properties.sync().then(() => loadData(localStorage.getItem("crm_token")))}>Sync IDX</button>
                    <div style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>Background worker auto-syncs every X minutes</div>
                  </div>

                  <PropertySearch onResults={setPropertiesData} />
                  <PropertyList properties={propertiesData} />

                  <div style={{ marginTop: 16 }}>
                    <h3>Team Leads</h3>
                    {teamsData[0] ? <AgentLeads leads={userLeads} /> : <div style={{ padding: 12, backgroundColor: darkMode ? "#1f2937" : "#f3f4f6", borderRadius: 6 }}>Create a team to enable lead capture.</div>}
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <h3>Lead Capture</h3>
                    {teamsData[0] ? <LeadCapture teamId={teamsData[0]._id} /> : <div style={{ padding: 12, backgroundColor: darkMode ? "#1f2937" : "#f3f4f6", borderRadius: 6 }}>Create a team to enable lead capture.</div>}
                  </div>
                </div>
              </div>
            ) : (
              // Agent dashboard
              <div>
                <h3>My Leads</h3>
                <AgentLeads leads={userLeads} />
                <div style={{ marginTop: 16 }}>
                  <h3>My Properties</h3>
                  <PropertyList properties={propertiesData.filter((p) => p.ownerId === user._id)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
