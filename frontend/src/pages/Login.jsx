import React, { useEffect, useState } from "react";
import api from "../api"; // <-- expects frontend/src/api.js (axios instance with baseURL set)

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("crm_dark") === "true");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // form state
  const [form, setForm] = useState({ name: "", email: "", password: "", teamId: "", newTeamName: "" });

  // teams for registration dropdown
  const [teams, setTeams] = useState([]);
  const [fetchingTeams, setFetchingTeams] = useState(false);

  // forgot password modal
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    document.body.style.background = darkMode ? "#0b1220" : "#f3f4f6";
    document.body.style.color = darkMode ? "#e6eef8" : "#111827";
    localStorage.setItem("crm_dark", darkMode ? "true" : "false");
  }, [darkMode]);

  useEffect(() => {
    if (!isLogin) fetchTeams();
  }, [isLogin]);

  async function fetchTeams() {
    setFetchingTeams(true);
    try {
      const res = await api.get("/teams"); // expects { data: [...] }
      setTeams(res.data?.data || res.data || []);
    } catch (err) {
      console.warn("Could not load teams:", err?.message || err);
      setMessage("Could not load teams. Creating a new team is still possible.");
    } finally {
      setFetchingTeams(false);
    }
  }

  function setField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  // ---------- Login ----------
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const payload = { email: form.email.trim(), password: form.password };
      const res = await api.post("/auth/login", payload);
      // expect res.data: { success:true, user, token } or { user, token } depending on your backend
      const data = res.data ?? res;
      const user = data.user || data.data?.user;
      const token = data.token || data.data?.token;
      if (!token || !user) throw new Error(data.error || "Invalid server response");
      localStorage.setItem("crm_token", token);
      localStorage.setItem("crm_user", JSON.stringify(user));
      setMessage("Login successful — redirecting...");
      // redirect to dashboard (or reload)
      setTimeout(() => window.location.href = "/", 700);
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Login failed";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  // ---------- Register (with team create/join) ----------
  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      // if newTeamName provided, create team first
      let teamId = form.teamId;
      if (form.newTeamName && form.newTeamName.trim()) {
        const createRes = await api.post("/teams", { name: form.newTeamName.trim() });
        const created = createRes.data?.data || createRes.data || createRes;
        // if your teams.create returns created team in data
        teamId = created._id || created.id || created?.data?._id;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        teamId: teamId || undefined,
      };

      const res = await api.post("/auth/register", payload);
      const data = res.data ?? res;
      // If backend returns token+user, auto-login
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      if (token && user) {
        localStorage.setItem("crm_token", token);
        localStorage.setItem("crm_user", JSON.stringify(user));
        setMessage("✅ Registered and logged in! Redirecting...");
        setTimeout(() => window.location.href = "/", 700);
        return;
      }

      // otherwise, show success message and switch to login
      setMessage("✅ Registration successful. You can now log in.");
      setIsLogin(true);
    } catch (err) {
      console.error("Register error:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Registration failed";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  // ---------- Forgot password ----------
  async function handleForgot(e) {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const res = await api.post("/auth/forgot", { email: forgotEmail.trim() });
      const data = res.data ?? res;
      setForgotMsg(data.message || "Check your email for reset instructions.");
    } catch (err) {
      console.error("Forgot password error:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Request failed";
      setForgotMsg(`❌ ${msg}`);
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: darkMode ? "#0b1220" : "#f3f4f6",
      color: darkMode ? "#e6eef8" : "#111827",
      transition: "all .25s ease"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 720,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        alignItems: "start"
      }}>
        {/* left: info / toggle */}
        <div style={{
          padding: 22,
          borderRadius: 12,
          background: darkMode ? "#0f1724" : "#ffffff",
          boxShadow: darkMode ? "0 6px 20px rgba(2,6,23,0.6)" : "0 6px 20px rgba(15,23,42,0.06)"
        }}>
          <h2 style={{ marginTop: 0 }}>{isLogin ? "Welcome back 👋" : "Create your account"}</h2>
          <p style={{ color: darkMode ? "#9fb0c8" : "#475569" }}>
            {isLogin
              ? "Sign in to access your team dashboard, leads and properties."
              : "Register an account and either join a team or create a new one."}
          </p>

          <div style={{ marginTop: 18 }}>
            <button onClick={() => { setIsLogin(true); setMessage(""); }} className="btn" style={{ marginRight: 8 }}>
              Login
            </button>
            <button onClick={() => { setIsLogin(false); setMessage(""); }} className="btn btn-primary">
              Register
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <button onClick={() => setDarkMode(d => !d)} className="btn" style={{ marginRight: 8 }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={() => setShowForgot(true)} className="btn">
              Forgot password?
            </button>
          </div>

          {message && (
            <div style={{
              marginTop: 18,
              padding: 10,
              borderRadius: 8,
              background: message.startsWith("❌") ? "#fee2e2" : "#ecfdf5",
              color: message.startsWith("❌") ? "#991b1b" : "#065f46"
            }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: 26, fontSize: 13, color: darkMode ? "#9fb0c8" : "#64748b" }}>
            Tip: If you are creating a new team, type the new team name in the "Create team" field on the right and it will be created for you automatically.
          </div>
        </div>

        {/* right: form */}
        <div style={{
          padding: 22,
          borderRadius: 12,
          background: darkMode ? "#0f1724" : "#ffffff",
          boxShadow: darkMode ? "0 6px 20px rgba(2,6,23,0.6)" : "0 6px 20px rgba(15,23,42,0.06)"
        }}>
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h3 style={{ marginTop: 0 }}>Login</h3>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} name="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
              <label style={labelStyle}>Password</label>
              <input type="password" style={inputStyle} name="password" value={form.password} onChange={(e) => setField("password", e.target.value)} required />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                <button type="button" className="btn" onClick={() => { setForm({ name: "", email: "", password: "", teamId: "", newTeamName: "" }); setMessage(""); }}>Clear</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h3 style={{ marginTop: 0 }}>Register</h3>

              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} name="name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />

              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" name="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />

              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" name="password" value={form.password} onChange={(e) => setField("password", e.target.value)} required />

              <div style={{ marginTop: 12 }}>
                <label style={labelStyle}>Join existing team</label>
                <select style={inputStyle} value={form.teamId} onChange={(e) => setField("teamId", e.target.value)} disabled={fetchingTeams}>
                  <option value="">— Select a team —</option>
                  {teams.map(t => <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>)}
                </select>
                <div style={{ marginTop: 8, color: darkMode ? "#9fb0c8" : "#475569", fontSize: 13 }}>
                  Or create a new team:
                </div>
                <input placeholder="Create team (optional)" style={{ ...inputStyle, marginTop: 8 }} value={form.newTeamName} onChange={(e) => setField("newTeamName", e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
                <button type="button" className="btn" onClick={() => { setForm({ name: "", email: "", password: "", teamId: "", newTeamName: "" }); setMessage(""); }}>Reset</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div style={{
          position: "fixed", left: 0, right: 0, top: 0, bottom: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(2,6,23,0.6)"
        }}>
          <div style={{ width: 420, padding: 20, borderRadius: 10, background: darkMode ? "#071026" : "#fff" }}>
            <h3 style={{ marginTop: 0 }}>Forgot password</h3>
            <p style={{ color: darkMode ? "#9fb0c8" : "#475569" }}>Enter the email for the account and we'll send password reset instructions (if configured on backend).</p>
            <input placeholder="Email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={inputStyle} />
            {forgotMsg && <div style={{ marginTop: 8, color: forgotMsg.startsWith("❌") ? "#991b1b" : "#065f46" }}>{forgotMsg}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={handleForgot} className="btn btn-primary" disabled={forgotLoading}>{forgotLoading ? "Sending..." : "Send"}</button>
              <button onClick={() => { setShowForgot(false); setForgotMsg(""); setForgotEmail(""); }} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function setField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }
}

// small inline style helpers
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(15,23,42,0.08)",
  marginTop: 6,
  boxSizing: "border-box"
};
const labelStyle = { marginTop: 12, display: "block", fontSize: 13, color: "inherit" };
