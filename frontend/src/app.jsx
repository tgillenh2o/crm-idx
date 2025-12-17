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

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/login" replace />;

  return element;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Team Member (agent) */}
          <Route
            path="/dashboard/member"
            element={
              <ProtectedRoute
                element={<TeamMemberDashboard />}
                roles={["agent"]}
              />
            }
          />
          <Route
            path="/dashboard/member/pond"
            element={
              <ProtectedRoute
                element={<TeamMemberLeadPond />}
                roles={["agent"]}
              />
            }
          />

          {/* Team Admin */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute
                element={<TeamAdminDashboard />}
                roles={["admin"]}
              />
            }
          />
          <Route
            path="/dashboard/admin/pond"
            element={
              <ProtectedRoute
                element={<TeamAdminLeadPond />}
                roles={["admin"]}
              />
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
