import React, { useEffect, useState } from "react";
import { auth, teams, properties, setAuthToken } from "./api";
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
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
      loadData(token);
    }
  }, []);

  // ------------------ Load Teams & Properties ------------------
  async function loadData(token) {
    setMessage("");
    try {
      const [tRes, pRes] = await Promise.all([
        teams.list(token),
        properties.list(token),
      ]);
      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
    } catch (err) {
      console.error("Load data error:", err);
      setMessage("Load failed: " + (err.message || "Unknown error"));
      setMessageType("error");
    }
  }

  // ------------------ Handle Login ------------------
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      const res = await auth.login({ email, password });
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

  // ------------------ Handle Register ------------------
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
      setMessage(res.message || "Registration successful! You can now login.");
      setMessageType("success");
      e.target.reset();
      setActiveTab("login");
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
    setMessage("");
  }

  // ------------------ JSX ------------------
  return (
    <div className="container" style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>CRM + IDX (cloud)</h1>

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
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 8 }}>
              <input name="email" type="email" placeholder="Email" required style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }} />
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db", width: "100%" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 8, top: 8, cursor: "pointer", fontSize: 12, color: "#6b7280" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button type="submit" style={{ padding: 10, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                Login
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 8 }}>
              <input name="name" placeholder="Name" required style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }} />
              <input name="email" type="email" placeholder="Email" required style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }} />
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db", width: "100%" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 8, top: 8, cursor: "pointer", fontSize: 12, color: "#6b7280" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  name="confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #d1d5db", width: "100%" }}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: "absolute", right: 8, top: 8, cursor: "pointer", fontSize: 12, color: "#6b7280" }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button type="submit" style={{ padding: 10, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                Register
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>
          {/* Logged-in User Section */}
          {message && (
            <div
              style={{
                padding: 10,
                marginBottom: 12,
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

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <strong>{user.name}</strong> <small>({user.role})</small>
              <div style={{ color: "#6b7280" }}>{user.email}</div>
            </div>
            <div>
              <button onClick={handleLogout} style={{ padding: 6, borderRadius: 4, cursor: "pointer", border: "1px solid #d1d5db" }}>
                Logout
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <div>
              <h3>Teams</h3>
              <TeamList teams={teamsData} />
              {user.role === "teamAdmin" && (
                <TeamAdminPanel user={user} onTeamsUpdated={() => loadData(localStorage.getItem("crm_token"))} />
              )}
              {user.role === "teamAdmin" && (
                <InvitePanel user={user} onInvitesCreated={() => loadData(localStorage.getItem("crm_token"))} />
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() =>
                    properties
                      .sync(localStorage.getItem("crm_token"))
                      .then(() => loadData(localStorage.getItem("crm_token")))
                  }
                  style={{ padding: 8, borderRadius: 4, backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  Sync IDX
                </button>
                <div style={{ color: "#6b7280" }}>Background worker auto-syncs every X minutes</div>
              </div>

              <PropertySearch onResults={setPropertiesData} />
              <PropertyList properties={propertiesData} />

              <div style={{ marginTop: 18 }}>
                <h3>Lead capture</h3>
                {teamsData[0] ? (
                  <LeadCapture teamId={teamsData[0]._id} />
                ) : (
                  <div style={{ padding: 12, borderRadius: 6, backgroundColor: "#f3f4f6" }}>Create a team to enable lead capture.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
