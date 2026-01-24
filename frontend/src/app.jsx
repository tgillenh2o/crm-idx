import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";

function DashboardRouter() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />; // redirect if not logged in

  return user.role === "teamAdmin"
    ? <AdminDashboard />
    : <MemberDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardRouter />} />
    </Routes>
  );
}
