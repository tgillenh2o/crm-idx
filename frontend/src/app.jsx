import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Dashboards
import MyLeads from "./pages/dashboard/member/MyLeads";
import MemberLeadPond from "./pages/dashboard/member/LeadPond";
import AllLeads from "./pages/dashboard/admin/AllLeads";
import AdminLeadPond from "./pages/dashboard/admin/LeadPond";

// Auth
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member */}
          <Route path="/dashboard/member" element={<ProtectedRoute element={<MyLeads />} roles={['teamMember']} />} />
          <Route path="/dashboard/member/pond" element={<ProtectedRoute element={<MemberLeadPond />} roles={['teamMember']} />} />

          {/* Admin */}
          <Route path="/dashboard/admin" element={<ProtectedRoute element={<AllLeads />} roles={['teamAdmin']} />} />
          <Route path="/dashboard/admin/pond" element={<ProtectedRoute element={<AdminLeadPond />} roles={['teamAdmin']} />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
