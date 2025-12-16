import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";
import LeadPond from "./pages/dashboard/LeadPond";

function Protected({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/admin"
          element={
            <Protected role="admin">
              <AdminDashboard />
            </Protected>
          }
        />

        <Route
          path="/dashboard/member"
          element={
            <Protected role="member">
              <MemberDashboard />
            </Protected>
          }
        />

        <Route
          path="/dashboard/pond"
          element={
            <Protected>
              <LeadPond />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
