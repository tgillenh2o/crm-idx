import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="topbar">
      <span>Welcome, {user?.email}</span>
      <button onClick={logout} style={{ cursor: "pointer" }}>Logout</button>
    </div>
  );
}
