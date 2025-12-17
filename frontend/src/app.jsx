import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function Login() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Login Page</h1>
      <p>If you see this, routing works.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
