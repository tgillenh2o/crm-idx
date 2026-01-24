import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";

function DashboardRouter() {
  const { user } = useContext(AuthContext);
<Route path="/dashboard" element={<DashboardRouter />} />


  if (!user) return null;

  return user.role === "teamAdmin"
    ? <AdminDashboard />
    : <MemberDashboard />;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
