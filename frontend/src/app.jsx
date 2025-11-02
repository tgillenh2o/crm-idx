// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";         // Your main landing page
import Register from "./pages/Register"; // Your registration page
import Login from "./pages/Login";       // Your login page
import Verified from "./pages/Verified"; // Your email verified page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verified" element={<Verified />} />
      </Routes>
    </Router>
  );
}

export default App;
