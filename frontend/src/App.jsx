import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Login() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Login Page</h1>
      <p>If you see this, Auth + Router are stable.</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const auth = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h2>ProtectedRoute Debug</h2>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </div>
  );
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
