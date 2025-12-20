// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <Link to="/register">Go to Register</Link>
    </div>
  );
}

function Register() {
  return (
    <div>
      <h1>Register Page</h1>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
