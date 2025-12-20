import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import MemberDashboard from "./pages/dashboard/member/MemberDashboard";

<Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute role="teamAdmin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/member"
  element={
    <ProtectedRoute role="member">
      <MemberDashboard />
    </ProtectedRoute>
  }
/>
