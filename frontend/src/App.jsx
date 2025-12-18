// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import TeamAdminDashboard from "./pages/dashboard/admin/Dashboard";
import TeamAdminLeadPond from "./pages/dashboard/admin/LeadPond";
import TeamMemberDashboard from "./pages/dashboard/member/Dashboard";
import TeamMemberLeadPond from "./pages/dashboard/member/LeadPond";

// ProtectedRoute component
function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Team Admin routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={["teamAdmin"]}>
                <TeamAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/pond"
            element={
              <ProtectedRoute roles={["teamAdmin"]}>
                <TeamAdminLeadPond />
              </ProtectedRoute>
            }
          />

          {/* Team Member routes */}
          <Route
            path="/dashboard/member"
            element={
              <ProtectedRoute roles={["teamMember"]}>
                <TeamMemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/member/pond"
            element={
              <ProtectedRoute roles={["teamMember"]}>
                <TeamMemberLeadPond />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
