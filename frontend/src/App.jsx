import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Dashboards
import IndependentMyLeads from "./pages/dashboard/independent/MyLeads";
import TeamMemberMyLeads from "./pages/dashboard/team-member/MyLeads";
import TeamMemberPond from "./pages/dashboard/team-member/LeadPond";
import TeamAdminAllLeads from "./pages/dashboard/team-admin/AllLeads";
import TeamAdminLeadPond from "./pages/dashboard/team-admin/LeadPond";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ element, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/login" />;
  return element;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Independent */}
          <Route path="/dashboard" element={<ProtectedRoute element={<IndependentMyLeads />} roles={['independent']} />} />

          {/* Team Member */}
          <Route path="/dashboard/member" element={<ProtectedRoute element={<TeamMemberMyLeads />} roles={['teamMember']} />} />
          <Route path="/dashboard/member/pond" element={<ProtectedRoute element={<TeamMemberPond />} roles={['teamMember']} />} />

          {/* Team Admin */}
          <Route path="/dashboard/admin" element={<ProtectedRoute element={<TeamAdminAllLeads />} roles={['teamAdmin']} />} />
          <Route path="/dashboard/admin/pond" element={<ProtectedRoute element={<TeamAdminLeadPond />} roles={['teamAdmin']} />} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
