import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function Login() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Login Page</h1>
      <p>If you see this, AuthProvider did not crash.</p>
    </div>
  );
}

 import { useAuth } from "./context/AuthContext";
 import { Navigate } from "react-router-dom";

  function ProtectedRoute({ children }) {
   const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />

  <Route path="/login" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <div style={{ padding: 40 }}>
          <h1>Dashboard</h1>
          <p>If you see this, protection works.</p>
        </div>
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}
