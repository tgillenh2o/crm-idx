import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";

export default function App() {
  const { user } = useContext(AuthContext);

  const Dashboard = () => {
    if (!user) return <Navigate to="/" replace />;
    return user.role === "teamAdmin"
      ? <AdminDashboard />
      : <MemberDashboard />;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
