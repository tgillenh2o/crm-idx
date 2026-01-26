import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div id="profile" className="profile-tab">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
