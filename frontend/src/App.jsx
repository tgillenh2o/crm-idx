import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import MemberDashboard from "./pages/dashboard/member/MemberDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
      // Admin route
<Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

// Member route
<Route
  path="/dashboard/member"
  element={
    <ProtectedRoute role="member">
      <MemberDashboard />
    </ProtectedRoute>
  }
/>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
