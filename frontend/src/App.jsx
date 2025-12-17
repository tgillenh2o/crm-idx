// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Dashboards
import TeamAdminDashboard from "./pages/dashboard/admin/Dashboard";
import TeamAdminLeadPond from "./pages/dashboard/admin/LeadPond";
import TeamMemberDashboard from "./pages/dashboard/member/Dashboard";
import TeamMemberLeadPond from "./pages/dashboard/member/LeadPond";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ element, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/login" />;
  return element;
}

<Route
  path="/"
  element={<Navigate to="/login" />}
/>


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Team Member */}
          <Route
            path="/dashboard/member"
            element={<ProtectedRoute element={<TeamMemberDashboard />} roles={["teamMember"]} />}
          />
          <Route
            path="/dashboard/member/pond"
            element={<ProtectedRoute element={<TeamMemberLeadPond />} roles={["teamMember"]} />}
          />

          {/* Team Admin */}
          <Route
            path="/dashboard/admin"
            element={<ProtectedRoute element={<TeamAdminDashboard />} roles={["teamAdmin"]} />}
          />
          <Route
            path="/dashboard/admin/pond"
            element={<ProtectedRoute element={<TeamAdminLeadPond />} roles={["teamAdmin"]} />}
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
