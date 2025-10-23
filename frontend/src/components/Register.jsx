// frontend/src/components/Register.jsx
import React, { useState, useContext } from "react";
import { auth } from "../api";
import { AuthContext } from "../context/AuthContext";

const validateEmail = (s) => /\S+@\S+\.\S+/.test(s);
const passwordStrength = (p) => {
  if (!p) return "";
  if (p.length < 6) return "Weak";
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return "Strong";
  return "Medium";
};

export default function Register({ switchToLogin }) {
  const { setUser } = useContext(AuthContext);
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrengthText, setPasswordStrengthText] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailOk, setEmailOk] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setMessage("");
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    const role = e.target.role.value || "agent";

    if (!name || !email || !password) {
      setErr("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      setErr("Invalid email format");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await auth.register({ name, email, password, role });
      // expect { success: true, user, token } or throw
      if (res && res.user && res.token) {
        // auto-login after register (optional). Here I store but switch to login instead:
        localStorage.setItem("crm_user", JSON.stringify(res.user));
        localStorage.setItem("crm_token", res.token);
        setUser(res.user);
        setMessage("Registration successful — logged in.");
      } else {
        setMessage("Registration successful — please login.");
        switchToLogin();
      }
    } catch (error) {
      setErr(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Create account</h3>
      {err && <div style={{ color: "#991b1b", marginBottom: 8 }}>{err}</div>}
      {message && <div style={{ color: "#065f46", marginBottom: 8 }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" className="input" placeholder="Full name" required />
        <input name="email" className="input" placeholder="Email" onChange={(e) => setEmailOk(validateEmail(e.target.value))} style={{ marginTop: 8 }} />
        {!emailOk && <div style={{ color: "#991b1b", fontSize: 12 }}>Invalid email</div>}

        <div style={{ position: "relative", marginTop: 8 }}>
          <input name="password" className="input" placeholder="Password" type={showPassword ? "text" : "password"} required onChange={(e)=> setPasswordStrengthText(passwordStrength(e.target.value))} />
          <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 8, top: 8 }}>{showPassword ? "Hide" : "Show"}</button>
        </div>
        {passwordStrengthText && <div style={{ fontSize: 12, color: "#6b7280" }}>Strength: {passwordStrengthText}</div>}

        <div style={{ position: "relative", marginTop: 8 }}>
          <input name="confirm" className="input" placeholder="Confirm password" type={showConfirm ? "text" : "password"} required onChange={(e) => setPasswordMatch(e.target.value === document.querySelector("input[name='password']").value)} />
          <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: "absolute", right: 8, top: 8 }}>{showConfirm ? "Hide" : "Show"}</button>
        </div>
        {!passwordMatch && <div style={{ color: "#991b1b", fontSize: 12 }}>Passwords do not match</div>}

        <select name="role" className="input" style={{ marginTop: 8 }}>
          <option value="agent">Agent</option>
          <option value="teamAdmin">Team Admin</option>
        </select>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={loading || !emailOk || !passwordMatch}>{loading ? "Creating..." : "Create account"}</button>
          <button type="button" className="btn" onClick={switchToLogin}>Back to login</button>
        </div>
      </form>
    </div>
  );
}
