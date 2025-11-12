import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Dashboards
import IndependentMyLeads from "./pages/dashboard/independent/MyLeads";
import TeamMemberMyLeads from "./pages/dashboard/team-member/MyLeads";
import TeamAdminAllLeads from "./pages/dashboard/team-admin/AllLeads";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ element, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/login" />;

  return element;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<IndependentMyLeads />} roles={['independent']} />}
          />
          <Route
            path="/dashboard/member"
            element={<ProtectedRoute element={<TeamMemberMyLeads />} roles={['teamMember']} />}
          />
          <Route
            path="/dashboard/admin"
            element={<ProtectedRoute element={<TeamAdminAllLeads />} roles={['teamAdmin']} />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
