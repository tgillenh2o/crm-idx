import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Login() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
    </div>
  );
}


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Allow if token exists (even before /me call)
  const hasToken = !!localStorage.getItem("token");

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

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
                  <p>Protected route works 🎉</p>
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
