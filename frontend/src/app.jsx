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

      console.log("Teams response:", tRes);
      console.log("Properties response:", pRes);

      if (!tRes.data || !pRes.data) {
        throw new Error("Invalid data returned from backend");
      }

      setTeamsData(tRes.data);
      setPropertiesData(pRes.data);
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
      setActiveTab("login"); // switch to login after successful registration
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
    <div className="container">
      <h1>CRM + IDX (cloud)</h1>

      {!user ? (
        <div style={{ maxWidth: 420 }}>
          {/* Message */}
          {message && (
            <div
              style={{
                padding: 8,
                marginBottom: 12,
                borderRadius: 4,
                backgroundColor: messageType === "success" ? "#d1fae5" : "#fee2e2",
                color: messageType === "success" ? "#065f46" : "#991b1b",
              }}
            >
              {message}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 16 }}>
            <button
              onClick={() => setActiveTab("login")}
              className={`btn ${activeTab === "login" ? "btn-primary" : "btn-secondary"}`}
              style={{ flex: 1 }}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`btn ${activeTab === "register" ? "btn-primary" : "btn-secondary"}`}
              style={{ flex: 1 }}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="card">
              <input name="email" className="input" placeholder="Email" required />
              <div style={{ height: 8 }} />
              <input name="password" type="password" className="input" placeholder="Password" required />
              <div style={{ height: 12 }} />
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="card">
              <input name="name" className="input" placeholder="Name" required />
              <div style={{ height: 8 }} />
              <input name="email" className="input" placeholder="Email" required />
              <div style={{ height: 8 }} />
              <input name="password" type="password" className="input" placeholder="Password" required />
              <div style={{ height: 8 }} />
              <input name="confirm" type="password" className="input" placeholder="Confirm Password" required />
              <div style={{ height: 12 }} />
              <button className="btn btn-primary" type="submit">
                Register
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>
          {message && (
            <div
              style={{
                padding: 8,
                marginBottom: 12,
                borderRadius: 4,
                backgroundColor: messageType === "success" ? "#d1fae5" : "#fee2e2",
                color: messageType === "success" ? "#065f46" : "#991b1b",
              }}
            >
              {message}
            </div>
          )}

          {/* Logged-in Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <strong>{user.name}</strong> <small>({user.role})</small>
              <div style={{ color: "#6b7280" }}>{user.email}</div>
            </div>
            <div>
              <button onClick={handleLogout} className="btn">
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    properties
                      .sync(localStorage.getItem("crm_token"))
                      .then(() => loadData(localStorage.getItem("crm_token")))
                  }
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
